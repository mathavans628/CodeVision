package codevision.controller;

import org.json.JSONObject;

import codevision.dao.CodeFileDAO;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/DeleteCodeServlet")
public class DeleteCodeServlet extends HttpServlet {
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
            String name = json.getString("name");

            boolean success = codeFileDAO.deleteProject(userId, name);
            
            System.out.println(success);

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