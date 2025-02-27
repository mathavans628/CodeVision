package codevision.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import codevision.util.JwtUtil;

@WebServlet("/CheckAuthServlet")
public class CheckAuthServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public CheckAuthServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("CheckAuthServlet Test");

        // Handle CORS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            setCorsHeaders(response); // Set CORS headers for preflight request
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Set CORS headers for actual request
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONObject jsonResponse = new JSONObject();
        try {
            String token = null;
            Cookie[] cookies = request.getCookies();

            // Retrieve auth_token from cookies
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("auth_token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        System.out.println("Auth token received: " + token); 
                        System.out.println(JwtUtil.getUserIdFromToken(token));
                        System.out.println(JwtUtil.getEmailFromToken(token));
                        System.out.println(JwtUtil.verifyToken(token));
                        break;
                    }
                }
            }

            // Validate token if present
            boolean isVerified = JwtUtil.verifyToken(token);
        	if(isVerified)
        	{
                jsonResponse.put("success", true);
                jsonResponse.put("message", "User is authenticated");
            } 
        	else {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "User is not authenticated");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 for unauthenticated
            }
        } catch (Exception e) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Authentication check failed: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 for server error
            System.out.println("Error in CheckAuthServlet: " + e.getMessage());
        }

        // Write response back to client
        response.getWriter().write(jsonResponse.toString());
    }

    private void setCorsHeaders(HttpServletResponse response) {
        // Use specific origin instead of "*" when credentials are included
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174"); // Adjust to your frontend URL
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
}