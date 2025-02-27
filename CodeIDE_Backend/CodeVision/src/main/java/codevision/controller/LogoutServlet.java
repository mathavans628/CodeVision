package codevision.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import codevision.dao.SessionDAO;
import codevision.util.JwtUtil;

@WebServlet("/LogoutServlet")
public class LogoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final SessionDAO sessionDAO = new SessionDAO();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Handle CORS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            setCorsHeaders(response);
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        JSONObject jsonResponse = new JSONObject();

        try {
            String token = getTokenFromCookie(request);
            
            if (token == null || token.trim().isEmpty()) {
                jsonResponse.put("message", "No active session");
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }

            boolean isVerified = JwtUtil.verifyToken(token);
            System.out.println("Token Verification: " + isVerified);

            if (isVerified) {
                // Clear auth_token cookie
                clearCookie(response, "auth_token");
                // Clear is_logged_in cookie (if present)
                clearCookie(response, "is_logged_in");

                boolean sessionRemoved = sessionDAO.deleteSession(token);

                if (sessionRemoved) 
                {
                    System.out.println("Session Deleted");
                    jsonResponse.put("message", "Logout successful");
                } 
                else 
                {
                    System.out.println("Session not Deleted");
                    jsonResponse.put("message", "Logout failed");
                }

                response.setStatus(HttpServletResponse.SC_OK);
            }
            else 
            {
                jsonResponse.put("message", "Invalid token or no active session");
                response.setStatus(HttpServletResponse.SC_OK);
            }
        }
        catch (Exception e) 
        {
            jsonResponse.put("message", "Logout failed");
        	response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Logout failed");
            System.out.println("Error in LogoutServlet: " + e.getMessage());
        }

        response.getWriter().write(jsonResponse.toString());
    }
    
    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
    
    private void clearCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, "");
        cookie.setHttpOnly(cookieName.equals("auth_token"));
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
}