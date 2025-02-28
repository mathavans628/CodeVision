package codevision.controller;

import java.io.IOException;
import java.io.InputStream;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import org.json.JSONObject;
import codevision.dao.UserDAO;
import codevision.model.User;

@WebServlet("/UpdateProfileImageServlet")
@MultipartConfig(maxFileSize = 10485760) // 10MB max
public class UpdateProfileImageServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONObject jsonResponse = new JSONObject();

        try {
            String userIdStr = request.getParameter("userId");
            String username = request.getParameter("username");
            Part filePart = request.getPart("profileImage");

            if (userIdStr == null || userIdStr.trim().isEmpty()) {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "User ID is required");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(jsonResponse.toString());
                return;
            }

            int userId = Integer.parseInt(userIdStr);
            byte[] imageData = null;
            String imageMimeType = null;

            if (filePart != null && filePart.getSize() > 0) {
                try (InputStream inputStream = filePart.getInputStream()) {
                    imageData = inputStream.readAllBytes();
                    imageMimeType = filePart.getContentType();
                }
            }

            // Update user details (image and/or username)
            userDAO.updateUserDetails(userId, username, imageData, imageMimeType);

            // Fetch updated user data
            User updatedUser = userDAO.getUserDetails(userId);
            if (updatedUser != null) {
                jsonResponse.put("success", true);
                jsonResponse.put("message", "Profile updated successfully");
                jsonResponse.put("userId", updatedUser.getUserId());
                jsonResponse.put("name", updatedUser.getUsername());
                jsonResponse.put("email", updatedUser.getEmail());
                if (updatedUser.getProfileImage() != null) {
                    String base64Image = java.util.Base64.getEncoder().encodeToString(updatedUser.getProfileImage());
                    jsonResponse.put("imageUrl", "data:" + updatedUser.getProfileImageType() + ";base64," + base64Image);
                } else {
                    jsonResponse.put("imageUrl", JSONObject.NULL);
                }
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Failed to retrieve updated user");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

        response.getWriter().write(jsonResponse.toString());
    }
}