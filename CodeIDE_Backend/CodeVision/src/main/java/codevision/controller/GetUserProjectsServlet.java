package codevision.controller;

import org.json.JSONArray;
import org.json.JSONObject;

import codevision.dao.CodeFileDAO;
import codevision.model.CodeFile;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/GetUserProjectsServlet")
public class GetUserProjectsServlet extends HttpServlet {
    private CodeFileDAO codeFileDAO = new CodeFileDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        try {
            int userId = Integer.parseInt(req.getParameter("userId"));
            List<CodeFile> projects = codeFileDAO.getUserCodeFiles(userId);
            JSONArray jsonArray = new JSONArray();
            for (CodeFile project : projects) {
                JSONObject json = new JSONObject();
                json.put("file_id", project.getFileId());
                json.put("file_name", project.getFilename());
                json.put("file_type", project.getFileType());
                jsonArray.put(json);
            }
            resp.getWriter().write(jsonArray.toString());
        } catch (Exception e) {
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", e.getMessage());
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(errorJson.toString());
        }
    }
}