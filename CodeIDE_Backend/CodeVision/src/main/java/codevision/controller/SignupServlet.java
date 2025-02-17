package codevision.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONObject;

import codevision.dao.UserDAO;

@WebServlet("/SignupServlet")
public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    public SignupServlet() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONObject jsonObject = new JSONObject();
        UserDAO userDAO = null;
        
		try 
		{
			userDAO = new UserDAO();
		}
		catch (SQLException e) 
		{
			System.out.println("Error during UserDAO object creation: " + e.getMessage());
		}

        try {
            // Read JSON request body
            BufferedReader reader = request.getReader();
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
            

            // Start transaction
            userDAO.beginTransaction();

            int userId = userDAO.createUser(email, password);

            if (userId == -1) {
                throw new Exception("User registration failed");
            }
            
            if (userId == -2) {
            	jsonObject.put("message", "User already exists with this email.");
                try (OutputStream outputStream = response.getOutputStream()) 
                {
                    byte[] responseBytes = jsonObject.toString().getBytes(StandardCharsets.UTF_8);
                    outputStream.write(responseBytes);
                    outputStream.flush();
                }
                catch (Exception e)
                {
					System.out.println("Error occurs during verifying user email is already exist" + e.getMessage());
				}
                return;
			}

            // Store security question & answer
            userDAO.storeSecurityQuestion(userId, securityQuestion, securityAnswer);

            // Store user details
            String defaultProfileUrl = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
            userDAO.storeUserDetails(userId, name, defaultProfileUrl);

            // Create user session
            String sessionId = userDAO.createSession(userId);

            // Commit transaction
            userDAO.commitTransaction();

            // Store session in HTTP session
            HttpSession session = request.getSession();
            session.setAttribute("session_id", sessionId);
            session.setAttribute("user_id", userId);
            
            System.out.println(sessionId);

            jsonObject.put("success", true);
            jsonObject.put("message", "User registered and GitHub repository created successfully");
            jsonObject.put("session_id", sessionId);

        }
        catch (Exception e) 
        {
            userDAO.rollbackTransaction();
            jsonObject.put("success", false);
            jsonObject.put("message", e.getMessage());
        }
        try (OutputStream outputStream = response.getOutputStream()) {
            byte[] responseBytes = jsonObject.toString().getBytes(StandardCharsets.UTF_8);
            outputStream.write(responseBytes);
            outputStream.flush();
        }
    }
}
