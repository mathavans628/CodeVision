package codevision.model;

import java.sql.Timestamp;
import java.util.Arrays;

public class CodeFile {
	private int fileId;          // Changed from codeId to match files table
	private int userId;
    private String filename;     // Unencrypted filename (decrypted in DAO)
    private int fileSize;        // Relevant for single files
    private String codeContent;  // For single files (previously encryptedCode)
    private String fileType;     // "web" or "single" (replaces fileTypeId)
    private String htmlContent;  // For web projects
    private String cssContent;   // For web projects
    private String jsContent;    // For web projects
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructor for single files
    public CodeFile(int fileId, int userId, String filename, String fileType, int fileSize, String codeContent, 
                    String fileExtension, Timestamp createdAt, Timestamp updatedAt) {
        this.fileId = fileId;
        this.userId = userId;
        this.filename = filename;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.codeContent = codeContent;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Constructor for web projects
    public CodeFile(int fileId, int userId, String filename, String fileType, String htmlContent, String cssContent, 
    		String jsContent, Timestamp createdAt, Timestamp updatedAt) {
        this.fileId = fileId;
        this.userId = userId;
        this.filename = filename;
        this.fileType = fileType;
        this.htmlContent = htmlContent;
        this.cssContent = cssContent;
        this.jsContent = jsContent;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public int getFileId() {
		return fileId;
	}

	public void setFileId(int fileId) {
		this.fileId = fileId;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public int getFileSize() {
		return fileSize;
	}

	public void setFileSize(int fileSize) {
		this.fileSize = fileSize;
	}

	public String getCodeContent() {
		return codeContent;
	}

	public void setCodeContent(String codeContent) {
		this.codeContent = codeContent;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	public String getHtmlContent() {
		return htmlContent;
	}

	public void setHtmlContent(String htmlContent) {
		this.htmlContent = htmlContent;
	}

	public String getCssContent() {
		return cssContent;
	}

	public void setCssContent(String cssContent) {
		this.cssContent = cssContent;
	}

	public String getJsContent() {
		return jsContent;
	}

	public void setJsContent(String jsContent) {
		this.jsContent = jsContent;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Timestamp getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}
	
	@Override
	public String toString() {
		return "CodeFile [fileId=" + fileId + ", userId=" + userId + ", filename=" + filename + ", fileSize=" + fileSize
				+ ", codeContent=" + codeContent + ", fileType=" + fileType + ", htmlContent="
				+ htmlContent + ", cssContent=" + cssContent + ", jsContent="
				+ jsContent + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
	}
}