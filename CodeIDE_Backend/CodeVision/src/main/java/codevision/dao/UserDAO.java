package codevision.dao;

import java.sql.*;
import java.util.Base64;
import java.util.UUID;

import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import codevision.model.User;
import codevision.util.AESUtil;
import codevision.util.BcryptUtil;
import codevision.util.DatabaseConnection;

public class UserDAO
{
    private Connection connection;

    public UserDAO() throws SQLException 
    {
        connection = DatabaseConnection.getConnection();
        connection.setAutoCommit(false);
    }
    

    // Begin Transaction
    public void beginTransaction() {
        try {
            connection.setAutoCommit(false);
        } catch (SQLException e) {
            System.out.println("Error starting transaction: " + e.getMessage());
        }
    }

    // Commit Transaction
    public void commitTransaction() {
        try {
            connection.commit();
            connection.setAutoCommit(true);
        } catch (SQLException e) {
            System.out.println("Error committing transaction: " + e.getMessage());
        }
    }

    // Rollback Transaction
    public void rollbackTransaction() {
        try {
            connection.rollback();
            connection.setAutoCommit(true);
        } catch (SQLException e) {
            System.out.println("Error rolling back transaction: " + e.getMessage());
        }
    }

    public int createUser(String email, String password) throws SQLException 
    {
    	if (isUserExists(email)) 
    	{
            System.out.println("User already exists with this email.");
            return -2;
        }
    	
        String sql = "INSERT INTO users (email, password, aes_key, iv) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) 
        {
            SecretKey aesKey = AESUtil.generateAESKey();
            IvParameterSpec iv = AESUtil.generateIV();

            // Encrypt Email
            String encryptedEmail = AESUtil.encrypt(email, aesKey, iv);
            // Hash Password
            String hashedPassword = BcryptUtil.hashPassword(password);

            stmt.setString(1, encryptedEmail);
            stmt.setString(2, hashedPassword);
            stmt.setString(3, Base64.getEncoder().encodeToString(aesKey.getEncoded()));
            stmt.setString(4, Base64.getEncoder().encodeToString(iv.getIV()));
            
            int rowsInserted = stmt.executeUpdate();

            if (rowsInserted > 0) 
            {
                try (ResultSet rs = stmt.getGeneratedKeys())
                {
                    if (rs.next())
                    {
                        return rs.getInt(1);
                    }
                }
            }
        } 
        catch (SQLException e) 
        {
            System.err.println("SQL Error creating user: " + e.getMessage());
            throw e;
        } 
        catch (Exception e) 
        {
            System.err.println("Encryption Error: " + e.getMessage());
        }
        return -1;
    }
    
    public void storeUserDetails(int userId, String name, String profileUrl) throws Exception {
        String sql = "INSERT INTO user_profiles (user_id, encrypted_username, profile_image) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            // Fetch AES Key & IV
            SecretKey aesKey = getAESKeyByUserId(userId);
            IvParameterSpec iv = getIVByUserId(userId);

            stmt.setInt(1, userId);
            stmt.setString(2, AESUtil.encrypt(name, aesKey, iv)); // Encrypt username
            stmt.setString(3, profileUrl); // Keep profile image unchanged
            stmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error storing user details: " + e.getMessage());
            throw e;
        }
    }

    
    public void storeSecurityQuestion(int userId, String question, String answer) throws Exception {
        String sql = "INSERT INTO user_security_questions (user_id, encrypted_question, encrypted_answer) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            // Fetch AES Key & IV
        	 SecretKey aesKey = getAESKeyByUserId(userId);
             IvParameterSpec iv = getIVByUserId(userId);

            stmt.setInt(1, userId);
            stmt.setString(2, AESUtil.encrypt(question, aesKey, iv));
            stmt.setString(3, AESUtil.encrypt(answer, aesKey, iv));
            stmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error storing security question: " + e.getMessage());
            throw e;
        }
    }
    
    public String createSession(int userId) throws SQLException {
        String sessionId = UUID.randomUUID().toString();
        String sql = "INSERT INTO sessions (session_id, user_id, login_time, expiry_time) VALUES (?, ?, NOW(), NOW() + INTERVAL 1 HOUR)";

        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, sessionId);
            stmt.setInt(2, userId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error creating session: " + e.getMessage());
            throw e;
        }
        return sessionId;
    }

    public User login(String email, String password) 
    {
        User user = null;
        String query = "SELECT u.user_id, up.encrypted_username, u.email, u.password, " +
                       "u.aes_key, u.iv, up.profile_image " +
                       "FROM users u " +
                       "JOIN user_profiles up ON u.user_id = up.user_id";

        try (PreparedStatement stmt = connection.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) 
        {
            while (rs.next())
            {
                SecretKey aesKey = AESUtil.getSecretKey(rs.getString("aes_key"));
                IvParameterSpec iv = AESUtil.getIvParameterSpec(rs.getString("iv"));

                String decryptedEmail = AESUtil.decrypt(rs.getString("email"), aesKey, iv);
                if (decryptedEmail.equals(email) && BcryptUtil.verifyPassword(password, rs.getString("password"))) 
                {
                    user = new User(
                        rs.getInt("user_id"),
                        AESUtil.decrypt(rs.getString("encrypted_username"), aesKey, iv),
                        decryptedEmail,
                        rs.getString("password"),
                        null,
                        null,
                        aesKey,
                        iv,
                        rs.getBytes("profile_image")
                    );
                    break;
                }
            }
        }
        catch (Exception e) 
        {
            System.out.println("Error logging in: " + e.getMessage());
        }
        return user;
    }

    public boolean isUserExists(String email) 
    {
        String query = "SELECT email, aes_key, iv FROM users";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) 
        {
            while (rs.next()) 
            {
                SecretKey aesKey = AESUtil.getSecretKey(rs.getString("aes_key"));
                IvParameterSpec iv = AESUtil.getIvParameterSpec(rs.getString("iv"));
                String decryptedEmail = AESUtil.decrypt(rs.getString("email"), aesKey, iv);
            
                if (decryptedEmail.equals(email)) 
                {
                    return true;
                }
            }
        } 
        catch (Exception e) 
        {
            System.out.println("Error checking if user exists: " + e.getMessage());
        }
        return false;
    }
    
    public int getUserIdByEmail(String email) 
    {
        String query = "SELECT user_id, email, aes_key, iv FROM users";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) 
        {
            
            while (rs.next()) 
            {
                // Retrieve AES key and IV for decryption
                SecretKey aesKey = AESUtil.getSecretKey(rs.getString("aes_key"));
                IvParameterSpec iv = AESUtil.getIvParameterSpec(rs.getString("iv"));

                // Decrypt stored email
                String decryptedEmail = AESUtil.decrypt(rs.getString("email"), aesKey, iv);
                
                // Compare with input email
                if (decryptedEmail.equals(email)) 
                {
                    return rs.getInt("user_id"); 
                }
            }
        }
        catch (Exception e)
        {
            System.out.println("Error retrieving user ID: " + e.getMessage());
        }
        return -1;
    }

    public String getSecurityQuestionByUserId(int userId) 
    {
        String query = "SELECT usq.encrypted_question, u.aes_key, u.iv " +
                       "FROM user_security_questions usq " +
                       "JOIN users u ON usq.user_id = u.user_id " +
                       "WHERE usq.user_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) 
        {
            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) 
            {
                if (rs.next()) 
                {
                    SecretKey aesKey = AESUtil.getSecretKey(rs.getString("aes_key"));
                    IvParameterSpec iv = AESUtil.getIvParameterSpec(rs.getString("iv"));
                    String encryptedQuestion = rs.getString("encrypted_question");
                    return AESUtil.decrypt(encryptedQuestion, aesKey, iv);
                }
            }
        } 
        catch (Exception e) 
        {
            System.out.println("Error retrieving security question: " + e.getMessage());
        }
        return null;
    }
    
    public boolean verifySecurityAnswer(int userId, String providedAnswer) 
    {
        String query = "SELECT encrypted_answer FROM user_security_questions WHERE user_id = ?";
        
        try (PreparedStatement stmt = connection.prepareStatement(query)) 
        {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) 
            {
                if (rs.next()) 
                {
                    String encryptedAnswer = rs.getString("encrypted_answer");
                    
                    // Fetch AES key and IV for decryption
                    SecretKey secretKey = getAESKeyByUserId(userId);
                    IvParameterSpec iv = getIVByUserId(userId);
                    
                    if (secretKey == null || iv == null) 
                    {
                        System.err.println("Encryption data missing for user ID: " + userId);
                        return false;
                    }

                    // Decrypt stored answer
                    String decryptedAnswer = AESUtil.decrypt(encryptedAnswer, secretKey, iv);
                    // Compare and return result
                    return decryptedAnswer.equals(providedAnswer);
                }
            }
        } 
        catch (Exception e) 
        {
            System.err.println("Error verifying security answer: " + e.getMessage());
            return false;
        }
        return false;
    }
    
    public boolean resetPassword(String email, String newPassword) 
    {
    	try {
    	    connection = DatabaseConnection.getConnection();

    	    // Get user ID using email
    	    int userId = getUserIdByEmail(email);

    	    // Fetch AES key and IV for encryption
    	    SecretKey secretKey = getAESKeyByUserId(userId);
    	    IvParameterSpec iv = getIVByUserId(userId);

    	    // Encrypt the email for DB lookup
    	    String encryptEmail = AESUtil.encrypt(email, secretKey, iv);

    	    // Check if email exists
    	    PreparedStatement checkStmt = connection.prepareStatement("SELECT user_id FROM users WHERE email = ?");
    	    checkStmt.setString(1, encryptEmail);
    	    ResultSet rs = checkStmt.executeQuery();

    	    // Store the result before closing ResultSet
    	    boolean emailExists = rs.next();

    	    rs.close();
    	    checkStmt.close();

    	    if (!emailExists) {
    	        return false;
    	    }

    	    // Hash new password before storing
    	    String hashedPassword = BcryptUtil.hashPassword(newPassword);

    	    // Update password
    	    PreparedStatement updateStmt = connection.prepareStatement("UPDATE users SET password = ? WHERE email = ?");
    	    updateStmt.setString(1, hashedPassword);
    	    updateStmt.setString(2, encryptEmail);
    	    int updatedRows = updateStmt.executeUpdate();

    	    updateStmt.close();
    	    connection.close();

    	    return updatedRows > 0;
    	} 
    	catch (Exception e) {
    	    System.out.println("Error occurs during resetting the password: " + e.getMessage());
    	    return false;
    	}
    }
    
    public SecretKey getAESKeyByUserId(int userId) throws SQLException 
    {
    	connection = DatabaseConnection.getConnection();
        String sql = "SELECT aes_key FROM users WHERE user_id = ?";
        SecretKey aesKey = null;

        try (PreparedStatement stmt = connection.prepareStatement(sql)) 
        {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) 
            {
                if (rs.next())
                {
                    aesKey = AESUtil.getSecretKey(rs.getString("aes_key"));
                }
            }
        }
        catch (SQLException e) 
        {
            System.out.println("Error retrieving AES key: " + e.getMessage());
        }
        return aesKey;
    }
    
    public IvParameterSpec getIVByUserId(int userId) throws SQLException 
    {
    	connection = DatabaseConnection.getConnection();
        String sql = "SELECT iv FROM users WHERE user_id = ?";
        IvParameterSpec iv = null;

        try (PreparedStatement stmt = connection.prepareStatement(sql)) 
        {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) 
            {
                if (rs.next()) 
                {
                    iv = AESUtil.getIvParameterSpec(rs.getString("iv"));
                }
            }
        } 
        catch (SQLException e) 
        {
            System.out.println("Error retrieving IV: " + e.getMessage());
        }
        return iv;
    }
}