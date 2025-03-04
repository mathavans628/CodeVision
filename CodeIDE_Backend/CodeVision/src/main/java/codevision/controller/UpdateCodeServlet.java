package codevision.controller;

import org.json.JSONObject;

import codevision.dao.CodeFileDAO;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/UpdateCodeServlet")
public class UpdateCodeServlet extends HttpServlet {
    private CodeFileDAO codeFileDAO = new CodeFileDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        try {
            StringBuilder payload = new StringBuilder();
            try (BufferedReader reader = req.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) {
                    payload.append(line);
                }
            }
            JSONObject json = new JSONObject(payload.toString());
            int userId = json.getInt("userId");
            String file_name = json.getString("name");
            boolean success;

            System.out.println("S@#$%^&*()+====> " + json.has("html"));
            if (json.has("html")) {
                String html = json.getString("html");
                String css = json.getString("css");
                String js = json.getString("js");
                System.out.println(html);
                success = codeFileDAO.updateWebFile(userId, file_name, html.getBytes(), css.getBytes(), js.getBytes()); // Overwrites existing
            } else {
                String content = json.getString("content");
                success = codeFileDAO.updateCodeFile(userId, file_name, content);
            }

            JSONObject response = new JSONObject();
            response.put("success", success);
            resp.getWriter().write(response.toString());
        } catch (Exception e) {
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", e.getMessage());
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(errorJson.toString());
        }
    }
}