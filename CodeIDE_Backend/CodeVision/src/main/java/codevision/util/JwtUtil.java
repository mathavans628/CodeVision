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
            System.out.println("Warning: Using default secure key. Set JWT_SECRET for better security.");
            secret = "CodeAiD2025VeryLongSecretKey1234567890";
        }
        SECRET_KEY = secret;

        long expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 Days
        String expires = System.getenv("JWT_EXPIRATION_MINUTES");
        if (expires != null && !expires.isEmpty()) {
            try {
                long parsedExpiration = Long.parseLong(expires) * 60 * 1000;
                if (parsedExpiration <= 0) {
                    System.out.println("JWT_EXPIRATION_MINUTES must be positive. Using default (30 min).");
                } else {
                    expirationTime = parsedExpiration;
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid JWT_EXPIRATION_MINUTES value. Using default (30 min).");
            }
        }
        EXPIRATION_TIME = expirationTime;
        System.out.println("JWT Expiration Time set to: " + (EXPIRATION_TIME / 1000) + " seconds");
    }

    public static String generateToken(int userId, String email) {
        try {
            long now = System.currentTimeMillis();
            Date expiresAt = new Date(now + EXPIRATION_TIME);
            String token = JWT.create()
                    .withIssuer(ISSUER)
                    .withClaim("userId", userId)
                    .withClaim("email", email)
                    .withIssuedAt(new Date(now))
                    .withExpiresAt(expiresAt)
                    .sign(Algorithm.HMAC256(SECRET_KEY));
            System.out.println("Generated token with expiration: " + expiresAt);
            return token;
        } catch (IllegalArgumentException e) {
            System.out.println("Error generating token: Invalid secret key.");
            throw e;
        } catch (Exception e) {
            System.out.println("Unexpected error generating token: " + e.getMessage());
            throw new RuntimeException("Failed to generate token", e);
        }
    }

    public static boolean verifyToken(String token) {
        System.out.println("Verifying token: " + token);
        DecodedJWT jwt = decodeToken(token);
        if (jwt == null) return false;

        long now = System.currentTimeMillis();
        long expiresAt = jwt.getExpiresAt().getTime();
        boolean isValid = now < expiresAt;
        if (!isValid) {
            System.out.println("Token has expired: " + new Date(expiresAt));
        }
        return isValid;
    }

    public static Integer getUserIdFromToken(String token) {
        DecodedJWT jwt = decodeToken(token);
        return (jwt != null) ? jwt.getClaim("userId").asInt() : null;
    }

    public static String getEmailFromToken(String token) {
        DecodedJWT jwt = decodeToken(token);
        return (jwt != null) ? jwt.getClaim("email").asString() : null;
    }

    public static Date getExpirationDateFromToken(String token) {
        DecodedJWT jwt = decodeToken(token);
        return (jwt != null) ? jwt.getExpiresAt() : null;
    }

    public static long getExpirationTime(String token) {
        DecodedJWT jwt = decodeToken(token);
        return (jwt != null) ? jwt.getExpiresAt().getTime() : -1;
    }

    public static String refreshTokenIfNeeded(String token) {
        if (isTokenExpiringSoon(token)) {
            System.out.println("Token is about to expire, refreshing...");
            return refreshToken(token);
        }
        return token;
    }

    public static String refreshToken(String existingToken) {
        DecodedJWT jwt = decodeToken(existingToken);
        if (jwt == null) {
            System.out.println("Token refresh failed: Invalid token.");
            return null;
        }

        long now = System.currentTimeMillis();
        if (now >= jwt.getExpiresAt().getTime()) {
            System.out.println("Cannot refresh: Token already expired at " + jwt.getExpiresAt());
            return null;
        }

        return generateToken(
            jwt.getClaim("userId").asInt(),
            jwt.getClaim("email").asString()
        );
    }

    public static boolean isTokenExpiringSoon(String token) {
        long expiresAt = getExpirationTime(token);
        if (expiresAt == -1) {
            System.out.println("Cannot check expiration: Invalid token.");
            return false;
        }

        long timeLeft = expiresAt - System.currentTimeMillis();
        boolean expiringSoon = timeLeft > 0 && timeLeft < (20 * 60 * 1000);
        if (expiringSoon) {
            System.out.println("Token expiring soon, time left: " + (timeLeft / 1000) + " seconds");
        }
        return expiringSoon;
    }

    public static DecodedJWT decodeToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            System.out.println("Token is empty or null.");
            return null;
        }

        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET_KEY))
                    .withIssuer(ISSUER)
                    .build();
            return verifier.verify(token);
        } catch (JWTVerificationException e) {
            System.out.println("JWT verification failed: " + e.getMessage());
            return null;
        }
    }

    public static long getConfiguredExpirationTime() {
        return EXPIRATION_TIME;
    }
}