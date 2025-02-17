package codevision.util;

import org.mindrot.jbcrypt.BCrypt;

public class BcryptUtil {
    // Hash password using Bcrypt
    public static String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(12));
    }

    // Verify password
    public static boolean verifyPassword(String password, String hashedPassword) {
        return BCrypt.checkpw(password, hashedPassword);
    }
}
