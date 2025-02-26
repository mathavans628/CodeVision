package codevision.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONObject;

import codevision.dao.SessionDAO;
import codevision.dao.UserDAO;
import codevision.model.User;
import codevision.util.JwtUtil;

@WebServlet("/SignupServlet")
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

        try (BufferedReader reader = request.getReader()) {
            StringBuilder requestBody = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }

            JSONObject requestData = new JSONObject(requestBody.toString());
            String name = requestData.getString("name");
            String email = requestData.getString("email");
            String password = requestData.getString("password");
            String securityQuestion = requestData.getString("securityQuestion");
            String securityAnswer = requestData.getString("securityAnswer");

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
            String defaultProfileUrl = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
            userDAO.storeUserDetails(userId, name, defaultProfileUrl);

            userDAO.commitTransaction();
            
            User user = userDAO.login(email, password);
            System.out.println("------------------>>> " + user);
            if (user != null) {
                // Generate JWT token and set cookie (like LoginServlet)
                String jwtToken = JwtUtil.generateToken(user.getUserId(), email);
                System.out.println("Created Token: " + jwtToken);

                long expirationTime = JwtUtil.getExpirationTime(jwtToken);
                Timestamp expiryTimestamp = new Timestamp(expirationTime);

                Cookie authCookie = new Cookie("auth_token", jwtToken);
                authCookie.setHttpOnly(true);
                authCookie.setSecure(false); // Set to true in production
                authCookie.setPath("/");
                authCookie.setMaxAge((int) (expirationTime / 1000));
                response.addCookie(authCookie);

                // Create session
                boolean sessionAdded = sessionDAO.createSession(jwtToken, user.getUserId(), expiryTimestamp);
                System.out.println("Is the Session created: " + sessionDAO.isSessionValid(jwtToken));

                if (sessionAdded) {
                    System.out.println("Session created successfully.");
                } else {
                    System.out.println("Failed to create session.");
                    jsonObject.put("success", false);
                    jsonObject.put("message", "Session creation failed.");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    sendResponse(response, jsonObject);
                    return;
                }

                jsonObject.put("success", true);
                jsonObject.put("message", "User registered successfully");
                jsonObject.put("jwtToken", jwtToken); // Optional, for consistency with LoginServlet
                jsonObject.put("user_id", user.getUserId()); // Optional
                response.setStatus(HttpServletResponse.SC_CREATED);
            } else {
                jsonObject.put("success", false);
                jsonObject.put("message", "Invalid email or password"); // Shouldn’t happen post-signup
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        } catch (Exception e) {
            userDAO.rollbackTransaction();
            jsonObject.put("success", false);
            jsonObject.put("message", "Error: " + e.getMessage());
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