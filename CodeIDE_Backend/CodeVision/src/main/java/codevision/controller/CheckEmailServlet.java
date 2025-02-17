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

@WebServlet("/CheckEmailServlet")
public class CheckEmailServlet extends HttpServlet 
{
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
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
        
        try 
        {
        	// Read JSON request body
            BufferedReader reader = request.getReader();
            StringBuilder json = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) 
            {
                json.append(line);
            }
            
            JSONObject jsonObject = new JSONObject(json.toString());
            String email = jsonObject.optString("email", null);

            System.out.println("Received email: " + email);
            
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

            String encryptedQuestion = userDAO.getSecurityQuestionByUserId(userId);

            System.out.println(encryptedQuestion);
            String securityQuestion = (encryptedQuestion != null) ? encryptedQuestion : "What is your friend's name?"; 
            out.print("{\"success\": true, \"securityQuestion\": \"" + securityQuestion + "\"}");

        } 
        catch (Exception e) 
        {
        	System.out.println("Error checking email: " + e.getMessage());
            out.print("{\"success\": false, \"message\": \"Error checking email\"}");
        }
        finally 
        {
            out.close();
        }
    }
}