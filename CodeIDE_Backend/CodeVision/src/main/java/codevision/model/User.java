package codevision.model;

import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

public class User 
{
    private int userId;
    private String username;
    private String email;
    private String password;
    private String forgotPasswordQuestion;
    private String forgotPasswordAnswer;
    private SecretKey aesKey; // AES encryption key
    private IvParameterSpec iv; // Initialization Vector
    private byte[] profileImage; // Profile Image as byte array
    private String profileImageType;

    public User()
    {
    	// Empty Constructor
    }
    
    // Constructor with all fields
    public User(int userId, String username, String email, String password, String forgotPasswordQuestion, 
            String forgotPasswordAnswer, SecretKey aesKey, IvParameterSpec iv, byte[] profileImage, String profileImageType) {
	    this.userId = userId;
	    this.username = username;
	    this.email = email;
	    this.password = password;
	    this.forgotPasswordQuestion = forgotPasswordQuestion;
	    this.forgotPasswordAnswer = forgotPasswordAnswer;
	    this.aesKey = aesKey;
	    this.iv = iv;
	    this.profileImage = profileImage;
	    this.profileImageType = profileImageType;
    }

    // Constructor without user ID (For new user registration)
    public User(String username, String email, String password, String forgotPasswordQuestion,
                String forgotPasswordAnswer, SecretKey aesKey, IvParameterSpec iv, byte[] profileImage) 
    {
        this.username = username;
        this.email = email;
        this.password = password;
        this.forgotPasswordQuestion = forgotPasswordQuestion;
        this.forgotPasswordAnswer = forgotPasswordAnswer;
        this.aesKey = aesKey;
        this.iv = iv;
        this.profileImage = profileImage;
    }

    // Getters and Setters
    public int getUserId() 
    {
        return userId;
    }

    public void setUserId(int userId)
    {
        this.userId = userId;
    }

    public String getUsername() 
    {
        return username;
    }

    public void setUsername(String username) 
    {
        this.username = username;
    }

    public String getEmail() 
    {
        return email;
    }

    public void setEmail(String email) 
    {
        this.email = email;
    }

    public String getPassword() 
    {
        return password;
    }

    public void setPassword(String password) 
    {
        this.password = password;
    }

    public String getForgotPasswordQuestion() 
    {
        return forgotPasswordQuestion;
    }

    public void setForgotPasswordQuestion(String forgotPasswordQuestion) 
    {
        this.forgotPasswordQuestion = forgotPasswordQuestion;
    }

    public String getForgotPasswordAnswer() 
    {
        return forgotPasswordAnswer;
    }

    public void setForgotPasswordAnswer(String forgotPasswordAnswer) 
    {
        this.forgotPasswordAnswer = forgotPasswordAnswer;
    }

    public SecretKey getAesKey() 
    {
        return aesKey;
    }

    public void setAesKey(SecretKey aesKey) 
    {
        this.aesKey = aesKey;
    }

    public IvParameterSpec getIv() 
    {
        return iv;
    }

    public void setIv(IvParameterSpec iv) 
    {
        this.iv = iv;
    }

    public byte[] getProfileImage() 
    {
        return profileImage;
    }

    public void setProfileImage(byte[] profileImage) 
    {
        this.profileImage = profileImage;
    }
    
    public String getProfileImageType() 
    {
    	return profileImageType; 
    }
    
    public void setProfileImageType(String profileImageType) 
    {
    	this.profileImageType = profileImageType; 
    }

    @Override
    public String toString() 
    {
        return "User [userId=" + userId + ", username=" + username + ", email=" + email + 
               ", forgotPasswordQuestion=" + forgotPasswordQuestion + ", forgotPasswordAnswer=" + forgotPasswordAnswer + ", Image" + profileImage + "]";
    }
}