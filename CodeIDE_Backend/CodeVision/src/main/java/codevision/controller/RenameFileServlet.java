package codevision.controller;

import org.json.JSONObject;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

import codevision.dao.CodeFileDAO;

@WebServlet("/RenameFileServlet")
public class RenameFileServlet extends HttpServlet {
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
            String oldFileName = json.getString("oldFileName");
            String newFileName = json.getString("newFileName");

            boolean success = codeFileDAO.renameFile(userId, oldFileName, newFileName);

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