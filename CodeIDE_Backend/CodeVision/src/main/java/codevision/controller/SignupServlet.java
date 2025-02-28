package codevision.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import org.json.JSONObject;

import codevision.dao.SessionDAO;
import codevision.dao.UserDAO;
import codevision.model.User;
import codevision.util.JwtUtil;

@WebServlet("/SignupServlet")
@MultipartConfig(maxFileSize = 10485760) // 10MB max file size
public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();
    private final SessionDAO sessionDAO = new SessionDAO();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            setCorsHeaders(response);
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JSONObject jsonObject = new JSONObject();

        try {
            // Extract form fields from multipart request
            String username = request.getParameter("username");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String securityQuestion = request.getParameter("securityQuestion");
            String securityAnswer = request.getParameter("securityAnswer");
            Part filePart = request.getPart("profileImage"); // Image file

            // Validate input
            if (username == null || email == null || password == null || securityQuestion == null || securityAnswer == null ||
                username.trim().isEmpty() || email.trim().isEmpty() || password.trim().isEmpty() || securityQuestion.trim().isEmpty() || securityAnswer.trim().isEmpty()) {
                jsonObject.put("success", false);
                jsonObject.put("message", "All fields are required");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                sendResponse(response, jsonObject);
                return;
            }

            // Begin database transaction
            userDAO.beginTransaction();
            int userId = userDAO.createUser(email, password);

            if (userId == -1) {
                throw new Exception("User registration failed");
            } else if (userId == -2) {
                jsonObject.put("success", false);
                jsonObject.put("message", "User already exists with this email.");
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                sendResponse(response, jsonObject);
                return;
            }

            userDAO.storeSecurityQuestion(userId, securityQuestion, securityAnswer);

            // Handle profile image
            byte[] imageData = null;
            if (filePart != null && filePart.getSize() > 0) {
                try (InputStream inputStream = filePart.getInputStream()) {
                    imageData = inputStream.readAllBytes(); // Read uploaded image
                }
            } else {
                // Use default image (assumes you’ve stored Default_Profile.png in resources or fetched from frontend)
                try (InputStream defaultImageStream = getServletContext().getResourceAsStream("/WEB-INF/Default_Profile.png")) {
                    if (defaultImageStream != null) {
                        imageData = defaultImageStream.readAllBytes();
                    } else {
                        throw new Exception("Default profile image not found");
                    }
                }
            }

            userDAO.storeUserDetails(userId, username, imageData); // Updated to store binary image data

            userDAO.commitTransaction();

            // Login user post-signup
            User user = userDAO.login(email, password);
            if (user != null) {
                String jwtToken = JwtUtil.generateToken(user.getUserId(), email);
                long expirationTime = JwtUtil.getExpirationTime(jwtToken);
                Timestamp expiryTimestamp = new Timestamp(expirationTime);

                Cookie authCookie = new Cookie("auth_token", jwtToken);
                authCookie.setHttpOnly(true);
                authCookie.setSecure(false); // Set to true in production with HTTPS
                authCookie.setPath("/");
                authCookie.setMaxAge((int) (expirationTime / 1000));
                response.addCookie(authCookie);

                Cookie flagCookie = new Cookie("is_logged_in", "true");
                flagCookie.setHttpOnly(false);
                flagCookie.setPath("/");
                flagCookie.setMaxAge((int) (expirationTime / 1000));
                response.addCookie(flagCookie);

                boolean sessionAdded = sessionDAO.createSession(jwtToken, user.getUserId(), expiryTimestamp);
                if (sessionAdded) {
                    jsonObject.put("success", true);
                    jsonObject.put("message", "User registered successfully");
                    jsonObject.put("jwtToken", jwtToken);
                    jsonObject.put("user_id", user.getUserId());
                    response.setStatus(HttpServletResponse.SC_CREATED);
                } else {
                    jsonObject.put("success", false);
                    jsonObject.put("message", "Session creation failed.");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
            } else {
                jsonObject.put("success", false);
                jsonObject.put("message", "Login failed after signup");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        } catch (Exception e) {
            userDAO.rollbackTransaction();
            jsonObject.put("success", false);
            jsonObject.put("message", "Error connecting to the server!");
            System.out.println("Error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

        sendResponse(response, jsonObject);
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private void sendResponse(HttpServletResponse response, JSONObject jsonObject) throws IOException {
        try (OutputStream outputStream = response.getOutputStream()) {
            byte[] responseBytes = jsonObject.toString().getBytes(StandardCharsets.UTF_8);
            outputStream.write(responseBytes);
            outputStream.flush();
        }
    }
}