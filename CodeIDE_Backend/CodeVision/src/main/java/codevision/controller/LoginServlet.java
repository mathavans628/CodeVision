package codevision.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import codevision.dao.UserDAO;
import codevision.model.User;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public LoginServlet() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        // Set CORS Headers first
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setStatus(HttpServletResponse.SC_OK);
        
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) 
        {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONObject jsonObject = new JSONObject();
        try
        {
            BufferedReader reader = request.getReader();
            StringBuilder responseBody = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null)
            {
                responseBody.append(line);
            }

            JSONObject requestData = new JSONObject(responseBody.toString());
            System.out.println("Login Request: " + requestData);

            String email = requestData.getString("email");
            String password = requestData.getString("password");
            
            System.out.println(email + " " + password);
            UserDAO userDAO = new UserDAO();
            User user = userDAO.login(email, password);
            System.out.println("===> " + user);

            if (user != null) {
                jsonObject.put("success", true);
                jsonObject.put("message", "Login successful");
            } else {
                jsonObject.put("success", false);
                jsonObject.put("message", "Invalid email or password");
            }
        } catch (Exception e) {
            jsonObject.put("success", false);
            jsonObject.put("message", "Error processing request");
        }

        try (OutputStream outputStream = response.getOutputStream()) {
            byte[] responseBytes = jsonObject.toString().getBytes("UTF-8");
            outputStream.write(responseBytes);
            outputStream.flush();
        }
    }
    
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); 
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}