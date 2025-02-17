package codevision.util;

import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

public class Main {
    public static void main(String[] args) {
        try {
            // AES Encryption and Decryption
            SecretKey secretKey = AESUtil.generateAESKey();
            IvParameterSpec iv = AESUtil.generateIV();

            String originalData = "Sensitive Data to Store";
            String encryptedData = AESUtil.encrypt(originalData, secretKey, iv);
            String decryptedData = AESUtil.decrypt(encryptedData, secretKey, iv);

            System.out.println("Original Data: " + originalData);
            System.out.println("Encrypted Data: " + encryptedData);
            System.out.println("Decrypted Data: " + decryptedData);
        } catch (Exception e) {
            System.out.println("Error during AES encryption/decryption: " + e.getMessage());
        }

        try {
            // Bcrypt Hashing and Verification
            String password = "SecurePassword123!";
            String hashedPassword = BcryptUtil.hashPassword(password);

            System.out.println("Hashed Password: " + hashedPassword);
            System.out.println("Password Match: " + BcryptUtil.verifyPassword(password, hashedPassword));
        } catch (Exception e) {
            System.out.println("Error during password hashing/verification: " + e.getMessage());
        }
    }
}
