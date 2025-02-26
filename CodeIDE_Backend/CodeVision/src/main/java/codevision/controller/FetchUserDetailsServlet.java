package codevision.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import codevision.dao.UserDAO;
import codevision.model.User;
import codevision.util.JwtUtil;

@WebServlet("/FetchUserDetailsServlet")

public class FetchUserDetailsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Allow CORS
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174"); // Change to your frontend URL
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Read userId from cookies
        int userId = getUserIdFromCookies(request);
        
        if (userId == -1) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("User not logged in");
            return;
        }

        User user = new UserDAO().getUserDetails(userId);
        
        System.out.println(user);

        if (user != null) {
            response.setContentType("application/json");
            response.getWriter().write("{");
            response.getWriter().write("\"userId\": " + user.getUserId() + ",");
            response.getWriter().write("\"name\": \"" + user.getUsername() + "\",");
            response.getWriter().write("\"email\": \"" + user.getEmail() + "\",");
            response.getWriter().write("\"profileImageUrl\": \"/fetchProfileImage?userId=" + user.getUserId() + "\"");
            response.getWriter().write("}");
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("User not found");
        }
    }
    
    // Helper method to get userId from cookies
    private int getUserIdFromCookies(HttpServletRequest request) 
    {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) 
        {
            for (Cookie cookie : cookies)
            {
            	if ("auth_token".equals(cookie.getName()))
                {
                    try 
                    {
                    	String token = cookie.getValue();
                        System.out.println("Auth token received: " + token); 
                        return JwtUtil.getUserIdFromToken(token);
                    }
                    catch (NumberFormatException e) 
                    {
                        return -1;
                    }
                }
            }
        }
        return -1; // No user ID cookie found
    }
}
