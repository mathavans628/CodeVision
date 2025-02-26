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
    
    public void storeUserDetails(int userId, String name, String profileUrl) throws Exception {
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
            pstmt.setString(3, profileUrl);
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
    
    public User login(String email, String password) throws SQLException
    {
        User user = null;
        String query = "SELECT u.user_id, up.encrypted_username, u.email, u.password, " +
                       "u.aes_key, u.iv, up.profile_image " +
                       "FROM users u " +
                       "JOIN user_profiles up ON u.user_id = up.user_id";
        
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        
        connection = getValidConnection(connection);
        
        try 
        {
        	pstmt = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
        	rs = pstmt.executeQuery();
        	
            while (rs.next())
            {
                SecretKey aesKey = AESUtil.getSecretKey(rs.getString("aes_key"));
                IvParameterSpec iv = AESUtil.getIvParameterSpec(rs.getString("iv"));

                String decryptedEmail = AESUtil.decrypt(rs.getString("email"), aesKey, iv);
                System.out.println(decryptedEmail.equals(email) + " " + decryptedEmail + " " + email + " " + BcryptUtil.verifyPassword(password, rs.getString("password")));
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
        catch (SQLException e) 
        {
            System.out.println("Error logging in: " + e.getMessage());
        }
        catch (Exception e) 
        {
            System.out.println("Error logging in: " + e.getMessage());
        }
        finally {
			closeConnection(connection);
		}
        return user;
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
    
    public User getUserDetails(int userID) {
        User user = null;
        String query = "SELECT u.user_id, u.email, u.password, u.aes_key, u.iv, " +
                       "up.encrypted_username, up.profile_image, " +
                       "usq.encrypted_question, usq.encrypted_answer " +
                       "FROM users u " +
                       "LEFT JOIN user_profiles up ON u.user_id = up.user_id " +
                       "LEFT JOIN user_security_questions usq ON u.user_id = usq.user_id " +
                       "WHERE u.user_id = ?";
        
        PreparedStatement pstmt = null;
        
        try {
        	connection = getValidConnection(connection);
        	pstmt = connection.prepareStatement(query);
            pstmt.setInt(1, userID);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                user = new User();
                // Convert stored Base64 AES key and IV back to SecretKey and IvParameterSpec
                String aesKeyBase64 = rs.getString("aes_key");
                String ivBase64 = rs.getString("iv");
                
                if (aesKeyBase64 == null || ivBase64 == null) {
                    throw new IllegalStateException("Encryption key or IV is missing for user: " + userID);
                }

                SecretKey secretKey = AESUtil.getSecretKey(aesKeyBase64);
                IvParameterSpec iv = AESUtil.getIvParameterSpec(ivBase64);
                
                user.setUserId(rs.getInt("user_id"));
                
                String email = AESUtil.decrypt(rs.getString("email"), secretKey, iv);
                user.setEmail(email);

                String password = rs.getString("password");
                user.setPassword(password);

                user.setAesKey(secretKey);
                user.setIv(iv);
                
                String username = AESUtil.decrypt(rs.getString("encrypted_username"), secretKey, iv);
                user.setUsername(username);
                
                user.setProfileImage(rs.getBytes("profile_image"));
                System.out.println(user.getProfileImage());
                
                String forgotPasswordQuestion = AESUtil.decrypt(rs.getString("encrypted_question"), secretKey, iv);
                user.setForgotPasswordQuestion(forgotPasswordQuestion);
                
                String forgotPasswordAnswer = AESUtil.decrypt(rs.getString("encrypted_answer"), secretKey, iv);
                user.setForgotPasswordAnswer(forgotPasswordAnswer);
            }
        } 
        catch (SQLException e) {
            System.out.println("Error fetching user details: " + e.getMessage());
        } 
        catch (NumberFormatException e) {
        	System.out.println("Error fetching user details: " + e.getMessage());
		} 
        catch (Exception e) {
			System.out.println("Error fetching user details: " + e.getMessage());
		}
        finally {
			closeConnection(connection);
		}
        
        return user;
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