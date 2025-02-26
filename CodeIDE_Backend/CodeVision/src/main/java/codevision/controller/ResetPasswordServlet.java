package codevision.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import codevision.dao.UserDAO;

@WebServlet("/ResetPasswordServlet")
public class ResetPasswordServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        JSONObject jsonResponse = new JSONObject();
        UserDAO userDAO = null;
        
		userDAO = new UserDAO();

        try {
            // Read JSON request
            StringBuilder requestBody = new StringBuilder();
            String line;
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }
            JSONObject jsonRequest = new JSONObject(requestBody.toString());

            String email = jsonRequest.optString("email", "");
            String newPassword = jsonRequest.optString("newPassword", "");

            // Validate input
            if (email.isEmpty() || newPassword.isEmpty()) {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Invalid input");
                out.print(jsonResponse.toString());
                return;
            }

            // Call UserDAO to update the password
            boolean isUpdated = userDAO.resetPassword(email, newPassword);

            if (isUpdated) {
                jsonResponse.put("success", true);
                jsonResponse.put("message", "Password updated successfully");
            } else {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Failed to update password or email not found");
            }
        } catch (Exception e) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Server error: " + e.getMessage());
        }

        out.print(jsonResponse.toString());
    }
}