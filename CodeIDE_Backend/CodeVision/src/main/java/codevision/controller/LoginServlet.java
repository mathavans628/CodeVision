package codevision.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
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

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();
    private final SessionDAO sessionDAO = new SessionDAO();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Handle CORS preflight
    	
    	System.out.println("kjhsakfas");
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            setCorsHeaders(response);
            response.setStatus(HttpServletResponse.SC_OK);
            System.out.println("SJ");
            return;
        }

        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONObject jsonResponse = new JSONObject();

        try (BufferedReader reader = request.getReader()) {
            StringBuilder requestBody = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }
            JSONObject requestData = new JSONObject(requestBody.toString());

            String email = requestData.getString("email");
            String password = requestData.getString("password");

            User user = userDAO.login(email, password);
            System.out.println("User========> " + user);
            if (user == null) {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Invalid email or password");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write(jsonResponse.toString());
                return;
            } 
            else
            {
                String jwtToken = JwtUtil.generateToken(user.getUserId(), email);
                System.out.println("Created Token: " + jwtToken);

                long expirationTime = JwtUtil.getExpirationTime(jwtToken);
                Timestamp expiryTimestamp = new Timestamp(expirationTime);
                
                Cookie authCookie = new Cookie("auth_token", jwtToken);
                authCookie.setHttpOnly(true);
                authCookie.setSecure(false);
                authCookie.setPath("/");
                authCookie.setMaxAge((int) (expirationTime / 1000));
                response.addCookie(authCookie);
                
                Cookie flagCookie = new Cookie("is_logged_in", "true");
                flagCookie.setHttpOnly(false); 
                flagCookie.setPath("/");
                flagCookie.setMaxAge((int) (expirationTime / 1000));
                response.addCookie(flagCookie);
                
                boolean sessionAdded = sessionDAO.createSession(jwtToken, user.getUserId(), expiryTimestamp);
                System.out.println("IS the Session is created" + sessionDAO.isSessionValid(jwtToken));
                
                if (sessionAdded) 
                {
                    System.out.println("Session created successfully.");
                } 
                else 
                {
                    System.out.println("Failed to create session.");
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Session creation failed.");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write(jsonResponse.toString());
                    return; 
                }

                jsonResponse.put("success", true);
                jsonResponse.put("message", "Login successful");
                jsonResponse.put("jwtToken", jwtToken);
                jsonResponse.put("user_id", user.getUserId());
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(jsonResponse.toString());
            }
        } 
        catch (Exception e)
        {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Error during login: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(jsonResponse.toString());
            System.out.println("Error in LoginServlet: " + e.getMessage());
        }
    }

    private void setCorsHeaders(HttpServletResponse response) 
    {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
}