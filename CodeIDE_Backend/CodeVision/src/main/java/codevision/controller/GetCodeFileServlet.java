package codevision.controller;

import org.json.JSONObject;

import codevision.dao.CodeFileDAO;
import codevision.model.CodeFile;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/GetCodeFileServlet")
public class GetCodeFileServlet extends HttpServlet {
    private CodeFileDAO codeFileDAO = new CodeFileDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        try {
            int userId = Integer.parseInt(req.getParameter("userId"));
            String filename = req.getParameter("filename");
            CodeFile file = codeFileDAO.getCodeFile(userId, filename);
            JSONObject json = new JSONObject();
            json.put("file_id", file.getFileId());
            json.put("file_name", file.getFilename());
            json.put("file_type", file.getFileType());
            if ("web".equals(file.getFileType())) {
                json.put("html_content", file.getHtmlContent());
                json.put("css_content", file.getCssContent());
                json.put("js_content", file.getJsContent());
            } else {
                json.put("code_content", file.getCodeContent());
            }
            resp.getWriter().write(json.toString());
        } catch (Exception e) {
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", e.getMessage());
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(errorJson.toString());
        }
    }
}