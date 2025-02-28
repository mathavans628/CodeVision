package codevision.dao;

import java.sql.*;
import java.util.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import codevision.model.User;
import codevision.util.AESUtil;
import codevision.util.BcryptUtil;
import codevision.util.DatabaseConnection;

public class UserDAO
{
    private Connection connection;

    public UserDAO() 
    {
        try 
        {
			connection = DatabaseConnection.getConnection();
		}
        catch (SQLException e) 
        {
        	System.out.println("Error occurs during UserDAO Object Creation: " + e.getMessage());
		}
    }
    
    private Connection getValidConnection(Connection connection) throws SQLException {
        if (connection == null || connection.isClosed()) {
            return DatabaseConnection.getConnection();
        }
        return connection;
    }

    // Begin Transaction
    public void beginTransaction() {
        try {
        	connection = getValidConnection(connection);
            connection.setAutoCommit(false);
        } catch (SQLException e) {
            System.out.println("Error starting transaction: " + e.getMessage());
        }
        finally {
			closeConnection(connection);
		}
    }

    // Commit Transaction
    public void commitTransaction() {
        try {
        	connection = getValidConnection(connection);
            if (connection != null && !connection.isClosed()) {
               connection.commit();
               connection.setAutoCommit(true);
            }
        } catch (SQLException e) {
            System.out.println("Error committing transaction: " + e.getMessage());
        }
        finally {
			closeConnection(connection);
		}
    }
    
    // Rollback Transaction
    public void rollbackTransaction() {
        try {
        	connection = getValidConnection(connection);
            if (connection != null && !connection.isClosed()) {
                connection.rollback();
                connection.setAutoCommit(true);
            }
        } catch (SQLException e) {
            System.out.println("Error rolling back transaction: " + e.getMessage());
        }
        finally {
			closeConnection(connection);
		}
    }

    public int createUser(String email, String password) throws SQLException 
    {
    	if (isUserExists(email)) 
    	{
            System.out.println("User already exists with this email.");
            return -2;
        }
    	
    	PreparedStatement pstmt = null;
    	
        String sql = "INSERT INTO users (email, password, aes_key, iv) VALUES (?, ?, ?, ?)";
        try 
        {
        	connection = getValidConnection(connection);
        	pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            SecretKey aesKey = AESUtil.generateAESKey();
            IvParameterSpec iv = AESUtil.generateIV();

            // Encrypt Email
            String encryptedEmail = AESUtil.encrypt(email, aesKey, iv);
            // Hash Password
            String hashedPassword = BcryptUtil.hashPassword(password);

            pstmt.setString(1, encryptedEmail);
            pstmt.setString(2, hashedPassword);
            pstmt.setString(3, Base64.getEncoder().encodeToString(aesKey.getEncoded()));
            pstmt.setString(4, Base64.getEncoder().encodeToString(iv.getIV()));
            
            int rowsInserted = pstmt.executeUpdate();

            if (rowsInserted > 0) 
            {
                try (ResultSet rs = pstmt.getGeneratedKeys())
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
        } 
        catch (Exception e) 
        {
            System.err.println("Encryption Error: " + e.getMessage());
        }
        finally {
        	pstmt.close();
			closeConnection(connection);
		}
        return -1;
    }
    
    public void storeUserDetails(int userId, String name,  byte[] profileUrl) throws Exception {
        String sql = "INSERT INTO user_profiles (user_id, encrypted_username, profile_image) VALUES (?, ?, ?)";
        
        connection = getValidConnection(connection);
        PreparedStatement pstmt = null;
        
        try {
        	pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        	
            // Fetch AES Key & IV
            SecretKey aesKey = getAESKeyByUserId(userId);
            IvParameterSpec iv = getIVByUserId(userId);

            pstmt.setInt(1, userId);
            pstmt.setString(2, AESUtil.encrypt(name, aesKey, iv)); 
            pstmt.setBytes(3, profileUrl);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error storing user details: " + e.getMessage());
        }
        finally {
			closeConnection(connection);
		}
    }

    
    public void storeSecurityQuestion(int userId, String question, String answer) throws Exception {
        String sql = "INSERT INTO user_security_questions (user_id, encrypted_question, encrypted_answer) VALUES (?, ?, ?)";
        
        System.out.println(userId + " " + question + " " + answer);
        
        PreparedStatement pstmt = null;
        
        try {
        	connection = getValidConnection(connection);
        	pstmt = connection.prepareStatement(sql);
        	
            // Fetch AES Key & IV
        	SecretKey aesKey = getAESKeyByUserId(userId);
            IvParameterSpec iv = getIVByUserId(userId);

            pstmt.setInt(1, userId);
            pstmt.setString(2, AESUtil.encrypt(question, aesKey, iv));
            pstmt.setString(3, AESUtil.encrypt(answer, aesKey, iv));
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error storing security question: " + e.getMessage());
        }
        finally {
			closeConnection(connection);
		}
    }
    
    public User login(String email, String password) throws SQLException {
        String query = "SELECT u.user_id, up.encrypted_username, u.email, u.password, u.aes_key, u.iv, " +
                       "up.profile_image, up.profile_image_type, " +
                       "usq.encrypted_question, usq.encrypted_answer " +
                       "FROM users u " +
                       "JOIN user_profiles up ON u.user_id = up.user_id " +
                       "LEFT JOIN user_security_questions usq ON u.user_id = usq.user_id " +
                       "WHERE u.email IS NOT NULL"; 
        
        connection = DatabaseConnection.getConnection();
        
        try (PreparedStatement pstmt = connection.prepareStatement(query); ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                SecretKey aesKey = AESUtil.getSecretKey(rs.getString("aes_key"));
                IvParameterSpec iv = AESUtil.getIvParameterSpec(rs.getString("iv"));
                String decryptedEmail = AESUtil.decrypt(rs.getString("email"), aesKey, iv);

                if (decryptedEmail.equals(email) && BcryptUtil.verifyPassword(password, rs.getString("password"))) {
                    String encryptedUsername = rs.getString("encrypted_username");
                    String encryptedQuestion = rs.getString("encrypted_question");
                    String encryptedAnswer = rs.getString("encrypted_answer");

                    return new User(
                        rs.getInt("user_id"),
                        encryptedUsername != null ? AESUtil.decrypt(encryptedUsername, aesKey, iv) : null,
                        decryptedEmail,
                        rs.getString("password"),
                        encryptedQuestion != null ? AESUtil.decrypt(encryptedQuestion, aesKey, iv) : null, // Decrypt question
                        encryptedAnswer != null ? AESUtil.decrypt(encryptedAnswer, aesKey, iv) : null,   // Decrypt answer
                        aesKey,
                        iv,
                        rs.getBytes("profile_image"),
                        rs.getString("profile_image_type")
                    );
                }
            }
        } catch (Exception e) {
            System.out.println("Error logging in: " + e.getMessage());
            throw new SQLException("Login failed", e);
        }
        finally {
			closeConnection(connection);
		}
        return null;
    }

    public boolean isUserExists(String email) 
    {
        String query = "SELECT email, aes_key, iv FROM users";
        
        try  
        {
        	connection = getValidConnection(connection);
        	PreparedStatement pstmt = connection.prepareStatement(query);
        	ResultSet rs = pstmt.executeQuery();
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
        finally {
			closeConnection(connection);
		}
        return false;
    }
    
    public int getUserIdByEmail(String email) 
    {
        String query = "SELECT user_id, email, aes_key, iv FROM users";
        
        try 
        {
        	connection = getValidConnection(connection);
        	PreparedStatement pstmt = connection.prepareStatement(query);
            ResultSet rs = pstmt.executeQuery();
            		
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
        finally {
			closeConnection(connection);
		}
        return -1;
    }

    public String getSecurityQuestionByUserId(int userId) 
    {
        String query = "SELECT usq.encrypted_question, u.aes_key, u.iv " +
                       "FROM user_security_questions usq " +
                       "JOIN users u ON usq.user_id = u.user_id " +
                       "WHERE usq.user_id = ?";
        
        try 
        {
        	connection = getValidConnection(connection);
        	PreparedStatement pstmt = connection.prepareStatement(query);
        	
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
        finally {
			closeConnection(connection);
		}
        return null;
    }
    
    public boolean verifySecurityAnswer(int userId, String providedAnswer) 
    {
        String query = "SELECT encrypted_answer FROM user_security_questions WHERE user_id = ?";
        
        try 
        {
        	connection = getValidConnection(connection);
        	PreparedStatement pstmt = connection.prepareStatement(query);
            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) 
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
        finally {
			closeConnection(connection);
		}
        return false;
    }
    
    public boolean resetPassword(String email, String newPassword) 
    {
    	try {
    		connection = getValidConnection(connection);
    		
    	    int userId = getUserIdByEmail(email);

    	    SecretKey secretKey = getAESKeyByUserId(userId);
    	    IvParameterSpec iv = getIVByUserId(userId);

    	    String encryptEmail = AESUtil.encrypt(email, secretKey, iv);

    	    // Check if email exists
    	    PreparedStatement checkStmt = connection.prepareStatement("SELECT user_id FROM users WHERE email = ?");
    	    checkStmt.setString(1, encryptEmail);
    	    ResultSet rs = checkStmt.executeQuery();

    	    boolean emailExists = rs.next();

    	    if (!emailExists) {
    	        return false;
    	    }

    	    String hashedPassword = BcryptUtil.hashPassword(newPassword);

    	    PreparedStatement updateStmt = connection.prepareStatement("UPDATE users SET password = ? WHERE email = ?");
    	    updateStmt.setString(1, hashedPassword);
    	    updateStmt.setString(2, encryptEmail);
    	    int updatedRows = updateStmt.executeUpdate();

    	    return updatedRows > 0;
    	} 
    	catch (Exception e) {
    	    System.out.println("Error occurs during resetting the password: " + e.getMessage());
    	    return false;
    	}
        finally {
			closeConnection(connection);
		}
    }
    
    public SecretKey getAESKeyByUserId(int userId) throws SQLException 
    {
        String sql = "SELECT aes_key FROM users WHERE user_id = ?";
        SecretKey aesKey = null;
        
        PreparedStatement pstmt = null;

        try  
        {
        	connection = getValidConnection(connection);
        	pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) 
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
        finally {
//        	pstmt.close();
			closeConnection(connection);
		}
        return aesKey;
    }
    
    public IvParameterSpec getIVByUserId(int userId) throws SQLException 
    {
        String sql = "SELECT iv FROM users WHERE user_id = ?";
        IvParameterSpec iv = null;
        
        connection = getValidConnection(connection);
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) 
        {
            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) 
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
        finally {
			closeConnection(connection);
		}
        return iv;
    }
    
    public User getUserDetails(int userId) throws SQLException {
        String query = "SELECT u.user_id, u.email, u.password, u.aes_key, u.iv, " +
                       "up.encrypted_username, up.profile_image, up.profile_image_type " +
                       "FROM users u JOIN user_profiles up ON u.user_id = up.user_id " +
                       "WHERE u.user_id = ?";
        
        connection = DatabaseConnection.getConnection();
        
        try (PreparedStatement pstmt = connection.prepareStatement(query)) {
            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    SecretKey aesKey = AESUtil.getSecretKey(rs.getString("aes_key"));
                    IvParameterSpec iv = AESUtil.getIvParameterSpec(rs.getString("iv"));

                    return new User(
                        rs.getInt("user_id"),
                        AESUtil.decrypt(rs.getString("encrypted_username"), aesKey, iv),
                        AESUtil.decrypt(rs.getString("email"), aesKey, iv),
                        rs.getString("password"),
                        null,
                        null,
                        aesKey,
                        iv,
                        rs.getBytes("profile_image"),
                        rs.getString("profile_image_type")
                    );
                }
            }
        } catch (Exception e) {
            System.out.println("Error fetching user details: " + e.getMessage());
            throw new SQLException("Failed to fetch user details", e);
        }
        return null;
    }

    public byte[] getProfileImage(int userId) throws SQLException {
        String sql = "SELECT profile_image FROM user_profiles WHERE user_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getBytes("profile_image");
                }
            }
        }
        return null;
    }

    public String getProfileImageType(int userId) throws SQLException {
        String sql = "SELECT profile_image_type FROM user_profiles WHERE user_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("profile_image_type");
                }
            }
        }
        return "image/png"; // Default MIME type
    }
    
    public void updateUserDetails(int userId, String username, byte[] profileImage, String profileImageType) throws SQLException {
        // Fetch current data to preserve if not updating
        User currentUser = getUserDetails(userId);
        if (currentUser == null) {
            throw new SQLException("User not found: " + userId);
        }

        String sql = "UPDATE user_profiles SET encrypted_username = ?, profile_image = ?, profile_image_type = ? WHERE user_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            SecretKey aesKey = getAESKeyByUserId(userId);
            IvParameterSpec iv = getIVByUserId(userId);

            // Update username if provided, else keep current
            pstmt.setString(1, username != null ? AESUtil.encrypt(username, aesKey, iv) : currentUser.getUsername());

            // Update image only if new data provided, else preserve existing
            if (profileImage != null) {
                pstmt.setBytes(2, profileImage);
                pstmt.setString(3, profileImageType);
            } else {
                pstmt.setBytes(2, currentUser.getProfileImage());
                pstmt.setString(3, currentUser.getProfileImageType() != null ? currentUser.getProfileImageType() : "image/png");
            }

            pstmt.setInt(4, userId);

            int rowsAffected = pstmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("No user found with user_id: " + userId);
            }
        } catch (Exception e) {
            System.err.println("Error updating user details: " + e.getMessage());
            throw new SQLException("Failed to update user details", e);
        }
    }
    
    private void closeConnection(Connection con) {
        try {
            if (con != null && !con.isClosed()) {
//                con.close();
            }
        } catch (SQLException e) {
            System.out.println("Error is ocuurs during Database Connection is Closing: " + e.getMessage());
        }
    }
}