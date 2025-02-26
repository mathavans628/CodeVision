package codevision.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import java.util.Date;

public class JwtUtil {
    private static final String SECRET_KEY;
    private static final long EXPIRATION_TIME;
    private static final String ISSUER = "CodeVision";

    static {
        String secret = System.getenv("JWT_SECRET");
        if (secret == null || secret.length() < 32) {
            System.out.println("JWT_SECRET not set or too short! Using default secure key.");
            secret = "CodeVision2025VeryLongSecretKey1234567890";
        }
        SECRET_KEY = secret;

        String expires = System.getenv("JWT_EXPIRATION_MINUTES");
        EXPIRATION_TIME = (expires != null && !expires.isEmpty()) ?
            Long.parseLong(expires) * 60 * 1000 : 30 * 60 * 1000;
    }

    public static String generateToken(int userId, String email) 
    {
        try 
        {
            return JWT.create()
                    .withIssuer(ISSUER)
                    .withClaim("userId", userId)
                    .withClaim("email", email)
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                    .sign(Algorithm.HMAC256(SECRET_KEY));
        } 
        catch (Exception e) 
        {
            return null;
        }
    }

    public static boolean verifyToken(String token) 
    {
        return decodeToken(token) != null;
    }

    public static Integer getUserIdFromToken(String token) 
    {
        DecodedJWT jwt = decodeToken(token);
        return (jwt != null) ? jwt.getClaim("userId").asInt() : null;
    }

    public static String getEmailFromToken(String token) 
    {
        DecodedJWT jwt = decodeToken(token);
        return (jwt != null) ? jwt.getClaim("email").asString() : null;
    }

    public static Date getExpirationTimeFromToken(String token) 
    {
        DecodedJWT jwt = decodeToken(token);
        return (jwt != null) ? jwt.getExpiresAt() : null;
    }

    public static long getExpirationTime(String token) 
    {
        try {
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256(SECRET_KEY))
                               .withIssuer(ISSUER)
                               .build()
                               .verify(token);
            return jwt.getExpiresAt().getTime();
        } catch (JWTVerificationException e) {
        	System.out.println("Token verification failed: " + e.getMessage());
            return -1;
        }
    }

    public static String refreshToken(String existingToken)
    {
        DecodedJWT jwt = decodeToken(existingToken);
        if (jwt != null) {
            return generateToken(
                jwt.getClaim("userId").asInt(),
                jwt.getClaim("email").asString()
            );
        }
        System.out.println("Token refresh failed: Invalid token");
        return null;
    }

    public static boolean isTokenExpiringSoon(String token)
    {
        long expiresAt = getExpirationTime(token);
        if (expiresAt == -1) return false;
        long timeLeft = expiresAt - System.currentTimeMillis();
        return timeLeft > 0 && timeLeft < (5 * 60 * 1000);
    }

    public static DecodedJWT decodeToken(String token) 
    {
        if (token == null || token.trim().isEmpty()) 
        {
            return null;
        }
        
        try 
        {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET_KEY))
                                     .withIssuer(ISSUER)
                                     .build();
            return verifier.verify(token);
        } 
        catch (JWTVerificationException e) 
        {
        	System.out.println("JWT verification failed: " + e.getMessage());
            return null;
        }
    }

    public static long getConfiguredExpirationTime() 
    {
        return EXPIRATION_TIME;
    }
}