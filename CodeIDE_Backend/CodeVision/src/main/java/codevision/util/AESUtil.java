package codevision.util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

public class AESUtil 
{
    private static final String AES_ALGORITHM = "AES/CBC/PKCS5Padding";

    // Generate a new AES key (256-bit)
    public static SecretKey generateAESKey() throws Exception 
    {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        return keyGen.generateKey();
    }

    // Convert Base64 key to SecretKey
    public static SecretKey getSecretKey(String base64Key) 
    {
        byte[] decodedKey = Base64.getDecoder().decode(base64Key.trim());
        if (decodedKey.length != 32)
        {
        	// AES-256 requires 32 bytes key
            throw new IllegalArgumentException("Invalid AES key size. Expected 256-bit key.");
        }
        return new SecretKeySpec(decodedKey, "AES");
    }

    // Convert Base64 IV to IvParameterSpec
    public static IvParameterSpec getIvParameterSpec(String base64Iv) 
    {
        byte[] decodedIv = Base64.getDecoder().decode(base64Iv.trim());
        if (decodedIv.length != 16) 
        { 
        	// IV must be 16 bytes for AES
            throw new IllegalArgumentException("Invalid IV size. Expected 16 bytes.");
        }
        return new IvParameterSpec(decodedIv);
    }

    // Encrypt data using AES (Uses provided IV)
    public static String encrypt(String data, SecretKey secretKey, IvParameterSpec iv) throws Exception 
    {
        Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);

        byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    // Decrypt data using AES (Uses provided IV)
    public static String decrypt(String encryptedData, SecretKey secretKey, IvParameterSpec iv) throws Exception
    {
        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedData.trim());

        Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);

        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    // Generate a new random IV
    public static IvParameterSpec generateIV() 
    {
        byte[] iv = new byte[16]; // 16 bytes IV for AES-CBC
        new SecureRandom().nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    // Convert SecretKey to Base64 string
    public static String encodeSecretKey(SecretKey secretKey) 
    {
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }

    // Convert IV to Base64 string
    public static String encodeIV(IvParameterSpec iv) 
    {
        return Base64.getEncoder().encodeToString(iv.getIV());
    }
}