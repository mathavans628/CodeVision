package codevision.filter;

import codevision.util.JwtUtil;
import com.auth0.jwt.interfaces.DecodedJWT;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")
public class AuthFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getRequestURI();

        // Allow public endpoints
<<<<<<< HEAD
        if (path.endsWith("/LoginServlet") || path.endsWith("/SignupServlet") || path.endsWith("/CheckAuthServlet") || path.endsWith("/SpeechToTextConvertServlet/StopRecording")) {
=======
        if (path.endsWith("/LoginServlet") || path.endsWith("/SignupServlet") || path.endsWith("/CheckAuthServlet") || path.endsWith("/") || path.endsWith("/SpeechToTextConvertServlet/StopRecording")
        		|| path.endsWith("/CheckEmailServlet") || path.endsWith("/VerifySecurityServlet") || path.endsWith("/ResetPasswordServlet")) {
>>>>>>> 304d35c4f8dfd93d12f3448e0f0da17a20551766
            chain.doFilter(request, response);
            return;
        }

        // Check Authorization header
        String token = extractToken(req);
        System.out.println(token);
        if (token != null) {
            DecodedJWT jwt = JwtUtil.decodeToken(token);
            if (jwt != null) {
                request.setAttribute("userId", jwt.getClaim("userId").asInt());
                chain.doFilter(request, response);
                return;
            }
        }

        // Unauthorized response
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setContentType("application/json");
        res.getWriter().write("{\"success\": false, \"message\": \"Unauthorized\"}");
    }

    // Extract JWT token from header or cookies
    private String extractToken(HttpServletRequest req) {
//        // Check Authorization header
//        String authHeader = req.getHeader("Authorization");
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            return authHeader.substring(7);
//        }

        // Check cookies
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
