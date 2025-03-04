package codevision.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import codevision.dao.CodeFileDAO;
import codevision.util.JwtUtil;

@WebServlet("/SaveCodeServlet")
public class SaveCodeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final CodeFileDAO codeFileDAO = new CodeFileDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONObject jsonResponse = new JSONObject();

        try {
            Integer userId = getUserIdFromCookies(request);
            if (userId == null || userId == -1) {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "User not authenticated.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            } else {
                StringBuilder requestBody = new StringBuilder();
                try (BufferedReader reader = request.getReader()) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        requestBody.append(line);
                    }
                }
                System.out.println("Received payload: " + requestBody.toString());

                JSONObject requestData = new JSONObject(requestBody.toString());
                String type = requestData.optString("type", null);

                if (type == null || type.trim().isEmpty()) {
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "File type is required (web or single).");
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                } else if ("single".equals(type)) {
                    String filename = requestData.optString("filename", null);
                    String codeContent = requestData.optString("content", null);
                    String fileExtension = requestData.optString("fileExtension", null);
                    
                    System.out.println("File Extension: " + fileExtension);

                    if (filename == null || filename.trim().isEmpty() || codeContent == null || codeContent.trim().isEmpty()) {
                        jsonResponse.put("success", false);
                        jsonResponse.put("message", "Invalid input data: filename and content are required and must not be empty.");
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    } else {
                        byte[] codeBytes = codeContent.getBytes();
                        int fileSize = codeBytes.length;
                        
                        if (codeFileDAO.isFilenameExists(userId, filename)) {
                            System.out.println("Duplicate filename detected: " + filename + " for userId: " + userId);
                            jsonResponse.put("success", false);
                            jsonResponse.put("message", "Filename already exists.");
                            response.setStatus(HttpServletResponse.SC_CONFLICT);
                        } else {
                            boolean isSaved = codeFileDAO.saveCodeFile(userId, filename, fileSize, codeBytes, fileExtension);
                            jsonResponse.put("success", isSaved);
                            jsonResponse.put("message", isSaved ? "Code file saved successfully." : "Failed to save code file.");
                            response.setStatus(isSaved ? HttpServletResponse.SC_OK : HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        }
                    }
                } else if ("web".equals(type)) {
                    System.out.println("Processing web project save...");
                    JSONObject webFiles = requestData.optJSONObject("webFiles");
                    if (webFiles == null) {
                        jsonResponse.put("success", false);
                        jsonResponse.put("message", "Web files data is required.");
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    } else {
                        String name = webFiles.optString("name", null);
                        String htmlContent = webFiles.optString("html", null);
                        String cssContent = webFiles.optString("css", null);
                        String jsContent = webFiles.optString("js", null);

                        if (name == null || name.trim().isEmpty()) {
                            jsonResponse.put("success", false);
                            jsonResponse.put("message", "Project name is required.");
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        } else {
                            System.out.println("Checking if filename exists: " + codeFileDAO.isFilenameExists(userId, name));
                            if (codeFileDAO.isFilenameExists(userId, name)) {
                                System.out.println("Duplicate filename detected: " + name + " for userId: " + userId);
                                jsonResponse.put("success", false);
                                jsonResponse.put("message", "Project name already exists.");
                                response.setStatus(HttpServletResponse.SC_CONFLICT);
                            } else {
                                byte[] htmlBytes = htmlContent != null ? htmlContent.getBytes() : null;
                                byte[] cssBytes = cssContent != null ? cssContent.getBytes() : null;
                                byte[] jsBytes = jsContent != null ? jsContent.getBytes() : null;

                                System.out.println("\nName: " + name + "\nHTML: " + htmlContent + "\nCSS: " + cssContent + "\nJavaScript: " + jsContent);

                                boolean isSaved = codeFileDAO.saveWebProject(userId, name, htmlBytes, cssBytes, jsBytes);
                                jsonResponse.put("success", isSaved);
                                jsonResponse.put("message", isSaved ? "Web project saved successfully." : "Failed to save web project.");
                                response.setStatus(isSaved ? HttpServletResponse.SC_OK : HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                            }
                        }
                    }
                } else {
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Invalid type: must be 'web' or 'single'.");
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

        // Single response write at the end
        System.out.println("Sending response: " + jsonResponse.toString());
        response.getWriter().write(jsonResponse.toString());
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private Integer getUserIdFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth_token".equals(cookie.getName())) {
                    try {
                        String token = cookie.getValue();
                        System.out.println("Auth token received: " + token);
                        Integer userId = JwtUtil.getUserIdFromToken(token);
                    	System.out.println("User ID====>" + userId);
                        if (userId == null) {
                            System.out.println("JwtUtil returned null userId for token: " + token);
                            return -1;
                        }
                        return userId;
                    } catch (Exception e) {
                        System.err.println("Error parsing userId from token: " + e.getMessage());
                        e.printStackTrace();
                        return -1;
                    }
                }
            }
            System.out.println("No auth_token cookie found among cookies");
        } else {
            System.out.println("No cookies found in request");
        }
        return -1;
    }
}