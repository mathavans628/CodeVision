package codevision.controller;

import java.io.IOException;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import codevision.dao.UserDAO;
import codevision.model.User;
import codevision.util.JwtUtil;

@WebServlet("/FetchUserDetailsServlet")
public class FetchUserDetailsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        int userId = getUserIdFromCookies(request);

        if (userId == -1) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"success\": false, \"message\": \"User not logged in\"}");
            return;
        }

        try {
            User user = userDAO.getUserDetails(userId);

            if (user != null) {
                JSONObject userData = new JSONObject();
                userData.put("userId", user.getUserId());
                userData.put("name", user.getUsername());
                userData.put("email", user.getEmail());
                
                byte[] imageData = user.getProfileImage();
                if (imageData != null) {
                    String mimeType = user.getProfileImageType();
                    String base64Image = java.util.Base64.getEncoder().encodeToString(imageData);
                    userData.put("imageUrl", "data:" + mimeType + ";base64," + base64Image);
                } else {
                    userData.put("imageUrl", JSONObject.NULL);
                }

                userData.put("forgotPasswordQuestion", user.getForgotPasswordQuestion() != null ? user.getForgotPasswordQuestion() : JSONObject.NULL);
                userData.put("forgotPasswordAnswer", user.getForgotPasswordAnswer() != null ? user.getForgotPasswordAnswer() : JSONObject.NULL);

                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(userData.toString());
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"success\": false, \"message\": \"User not found\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\": false, \"message\": \"Database error: " + e.getMessage() + "\"}");
        }
    }

    private int getUserIdFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth_token".equals(cookie.getName())) {
                    try {
                        String token = cookie.getValue();
                        System.out.println("Auth token received: " + token);
                        return JwtUtil.getUserIdFromToken(token);
                    } catch (NumberFormatException e) {
                        return -1;
                    }
                }
            }
        }
        return -1;
    }
}