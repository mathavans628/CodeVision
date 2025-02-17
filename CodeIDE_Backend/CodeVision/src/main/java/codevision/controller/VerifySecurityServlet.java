package codevision.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import codevision.dao.UserDAO;

/**
 * Servlet implementation class VerifySecurityServlet
 */
@WebServlet("/VerifySecurityServlet")
public class VerifySecurityServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public VerifySecurityServlet() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        UserDAO userDAO = null;
        
        try 
        {
            userDAO = new UserDAO();
        }
        catch (SQLException e) 
        {
            System.err.println("Error initializing UserDAO: " + e.getMessage());
            out.print("{\"success\": false, \"message\": \"Database connection error\"}");
            out.close();
            return;
        }

        try {
            // Parse JSON request body
            JSONObject requestData = parseRequest(request);
            String email = requestData.optString("email", "").trim();
            String securityAnswer = requestData.optString("securityAnswer", "").trim();

            // Validate input
            if (email.isEmpty() || securityAnswer.isEmpty()) {
                sendResponse(out, false, "Email and security answer are required");
                return;
            }

            // Check if user exists
            int userId = userDAO.getUserIdByEmail(email);
            System.out.println(userId);
            if (userId == -1) 
            {
                out.print("{\"success\": false, \"message\": \"User not found\"}");
                return;
            }

            // Fetch AES key and IV for decryption
            SecretKey secretKey = userDAO.getAESKeyByUserId(userId);
            IvParameterSpec iv = userDAO.getIVByUserId(userId);

            if (secretKey == null || iv == null)
            {
                out.print("{\"success\": false, \"message\": \"Encryption data missing\"}");
                return;
            }

            // Verify security answer from database
            boolean isVerified = userDAO.verifySecurityAnswer(userId, securityAnswer);

            if (isVerified) {
                sendResponse(out, true, "Security answer verified");
            } else {
                sendResponse(out, false, "Incorrect security answer");
            }

        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(out, false, "Server error");
        } finally {
            out.close();
        }
    }

    private void sendResponse(PrintWriter out, boolean success, String message) {
        JSONObject responseJson = new JSONObject();
        responseJson.put("success", success);
        responseJson.put("message", message);
        out.print(responseJson.toString());
        out.flush();
    }

    private JSONObject parseRequest(HttpServletRequest request) throws IOException {
        BufferedReader reader = request.getReader();
        StringBuilder json = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            json.append(line);
        }
        return new JSONObject(json.toString());
    }
}