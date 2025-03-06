package codevision.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import codevision.model.CodeFile;
import codevision.util.AESUtil;
import codevision.util.DatabaseConnection;

public class CodeFileDAO {
	private UserDAO userDAO;

	public CodeFileDAO() {
		try {
			userDAO = new UserDAO();
			System.out.println("CodeFileDAO initialized with UserDAO");
		} catch (Exception e) {
			System.out.println("Error initializing UserDAO in CodeFileDAO: " + e.getMessage());
			throw new RuntimeException("Failed to initialize CodeFileDAO", e);
		}
	}

	// Check if filename exists with a specific Connection
	// Check if filename exists by fetching all filenames and comparing after decryption
		private boolean isFilenameExists(Connection connection, int userId, String filename) throws SQLException {
			try (PreparedStatement stmt = connection
					.prepareStatement("SELECT encrypted_filename FROM files WHERE user_id = ?")) {

				stmt.setInt(1, userId);
				ResultSet rs = stmt.executeQuery();

				SecretKey aesKey = userDAO.getAESKeyByUserId(userId);
				IvParameterSpec iv = userDAO.getIVByUserId(userId);

				// Remove the extension before checking for duplicates
				String filenameWithoutExtension = filename.contains(".") ? filename.substring(0, filename.lastIndexOf('.'))
						: filename;

				System.out.println("Checking for duplicates. User provided: " + filenameWithoutExtension);

				while (rs.next()) {
					String encryptedName = rs.getString("encrypted_filename");
					String decryptedName = AESUtil.decrypt(encryptedName, aesKey, iv);

					// Remove the extension before checking for duplicates
					String storedFilename = decryptedName.contains(".") ? decryptedName.substring(0, decryptedName.lastIndexOf('.'))
							: decryptedName;

					System.out.println(filename);
					System.out.println("Comparing with stored filename: " + storedFilename);
					if (filenameWithoutExtension.equalsIgnoreCase(storedFilename)) {
						System.out.println("Duplicate found: " + decryptedName);
						return true;
					}
				}

				System.out.println("No duplicate found.");
				return false; // No match found
			} catch (Exception e) {
				System.out.println("Error checking filename existence: " + e.getMessage());
				throw new SQLException("Error in isFilenameExists", e);
			}
		}

		// Public method for checking filename existence
		public boolean isFilenameExists(int userId, String filename) {
			try (Connection connection = DatabaseConnection.getConnection()) {
				System.out.println("Connection for isFilenameExists established: " + connection);
				return isFilenameExists(connection, userId, filename);
			} catch (SQLException e) {
				System.out.println("Database error checking filename existence: " + e.getMessage());
				return false;
			}
		}

	public boolean saveWebProject(int userId, String name, byte[] htmlContent, byte[] cssContent, byte[] jsContent) {
		Connection connection = null;
		try {
			connection = DatabaseConnection.getConnection();
			System.out.println("Connection established for saveWebProject: " + connection);
			connection.setAutoCommit(false);

			SecretKey aesKey = userDAO.getAESKeyByUserId(userId);
			IvParameterSpec iv = userDAO.getIVByUserId(userId);
			String encryptedFilename = AESUtil.encrypt(name, aesKey, iv);
			String encryptedHtml = htmlContent != null ? AESUtil.encrypt(new String(htmlContent), aesKey, iv) : null;
			String encryptedCss = cssContent != null ? AESUtil.encrypt(new String(cssContent), aesKey, iv) : null;
			String encryptedJs = jsContent != null ? AESUtil.encrypt(new String(jsContent), aesKey, iv) : null;
			System.out.println("Encrypted filename: " + encryptedFilename);

			if (isFilenameExists(connection, userId, name)) {
				System.out.println("Filename already exists: " + name);
				connection.rollback();
				return false;
			}

			String fileSql = "INSERT INTO files (user_id, encrypted_filename, file_type) VALUES (?, ?, 'web')";
			int fileId;
			try (PreparedStatement fileStmt = connection.prepareStatement(fileSql, Statement.RETURN_GENERATED_KEYS)) {
				System.out.println("Preparing files insert statement");
				fileStmt.setInt(1, userId);
				fileStmt.setString(2, encryptedFilename);
				int rowsAffected = fileStmt.executeUpdate();
				System.out.println("Rows affected in files table: " + rowsAffected);
				if (rowsAffected == 0) {
					System.out.println("Failed to insert into files table");
					connection.rollback();
					return false;
				}
				try (ResultSet rs = fileStmt.getGeneratedKeys()) {
					if (rs.next()) {
						fileId = rs.getInt(1);
						System.out.println("Generated file_id: " + fileId);
					} else {
						System.out.println("Failed to get generated file_id");
						connection.rollback();
						return false;
					}
				}
			}

			String contentSql = "INSERT INTO web_project_contents (file_id, html_content, css_content, js_content) VALUES (?, ?, ?, ?)";
			try (PreparedStatement contentStmt = connection.prepareStatement(contentSql)) {
				System.out.println("Preparing web_project_contents insert statement");
				contentStmt.setInt(1, fileId);
				contentStmt.setBytes(2, encryptedHtml != null ? encryptedHtml.getBytes() : null);
				contentStmt.setBytes(3, encryptedCss != null ? encryptedCss.getBytes() : null);
				contentStmt.setBytes(4, encryptedJs != null ? encryptedJs.getBytes() : null);
				int rowsAffected = contentStmt.executeUpdate();
				System.out.println("Rows affected in web_project_contents table: " + rowsAffected);
				if (rowsAffected == 0) {
					System.out.println("Failed to insert into web_project_contents table");
					connection.rollback();
					return false;
				}
			}

			connection.commit();
			System.out.println("Transaction committed for saveWebProject: " + name);
			return true;
		} catch (SQLException e) {
			System.out.println("Database error in saveWebProject: " + e.getMessage());
			rollback(connection);
			return false;
		} catch (Exception e) {
			System.out.println("Encryption error in saveWebProject: " + e.getMessage());
			rollback(connection);
			return false;
		} finally {
			closeConnection(connection);
		}
	}

	public boolean saveCodeFile(int userId, String filename, int fileSize, byte[] codeContent, String fileExtension) {
		Connection connection = null;
		try {
			connection = DatabaseConnection.getConnection();
			System.out.println("Connection established for saveCodeFile: " + connection);
			connection.setAutoCommit(false);

			SecretKey aesKey = userDAO.getAESKeyByUserId(userId);
			IvParameterSpec iv = userDAO.getIVByUserId(userId);
			String encryptedFilename = AESUtil.encrypt(filename, aesKey, iv);
			String encryptedCode = AESUtil.encrypt(new String(codeContent), aesKey, iv);
			System.out.println("Encrypted filename: " + encryptedFilename);

			if (isFilenameExists(connection, userId, filename)) {
				System.out.println("Filename already exists: " + filename);
				connection.rollback();
				return false;
			}

			String fileSql = "INSERT INTO files (user_id, encrypted_filename, file_type) VALUES (?, ?, 'single')";
			int fileId;
			try (PreparedStatement fileStmt = connection.prepareStatement(fileSql, Statement.RETURN_GENERATED_KEYS)) {
				System.out.println("Preparing files insert statement");
				fileStmt.setInt(1, userId);
				fileStmt.setString(2, encryptedFilename);
				int rowsAffected = fileStmt.executeUpdate();
				System.out.println("Rows affected in files table: " + rowsAffected);
				if (rowsAffected == 0) {
					System.out.println("Failed to insert into files table");
					connection.rollback();
					return false;
				}
				try (ResultSet rs = fileStmt.getGeneratedKeys()) {
					if (rs.next()) {
						fileId = rs.getInt(1);
						System.out.println("Generated file_id: " + fileId);
					} else {
						System.out.println("Failed to get generated file_id");
						connection.rollback();
						return false;
					}
				}
			}

			String contentSql = "INSERT INTO file_contents (file_id, file_size, code_content, file_extension) VALUES (?, ?, ?, ?)";
			try (PreparedStatement contentStmt = connection.prepareStatement(contentSql)) {
				System.out.println("Preparing file_contents insert statement");
				contentStmt.setInt(1, fileId);
				contentStmt.setInt(2, fileSize);
				contentStmt.setBytes(3, encryptedCode.getBytes());
				contentStmt.setString(4, fileExtension);
				int rowsAffected = contentStmt.executeUpdate();
				System.out.println("Rows affected in file_contents table: " + rowsAffected);
				if (rowsAffected == 0) {
					System.out.println("Failed to insert into file_contents table");
					connection.rollback();
					return false;
				}
			}

			connection.commit();
			System.out.println("Transaction committed for saveCodeFile: " + filename);
			return true;
		} catch (SQLException e) {
			System.out.println("Database error in saveCodeFile: " + e.getMessage());
			rollback(connection);
			return false;
		} catch (Exception e) {
			System.out.println("Encryption error in saveCodeFile: " + e.getMessage());
			rollback(connection);
			return false;
		} finally {
			closeConnection(connection);
		}
	}

	public List<CodeFile> getUserCodeFiles(int userId) {
		List<CodeFile> codeFiles = new ArrayList<>();
		SecretKey aesKey;
		IvParameterSpec iv;
		try {
			aesKey = userDAO.getAESKeyByUserId(userId);
			iv = userDAO.getIVByUserId(userId);
		} catch (SQLException e) {
			System.out.println("Database error getting AES key/IV in getUserCodeFiles: " + e.getMessage());
			return codeFiles;
		}

		String singleQuery = "SELECT f.file_id, f.user_id, f.encrypted_filename, f.file_type, fc.file_size, fc.code_content, "
				+ "fc.file_extension, f.created_at, f.updated_at FROM files f "
				+ "JOIN file_contents fc ON f.file_id = fc.file_id WHERE f.user_id = ? AND f.file_type = 'single'";
		try (Connection connection = DatabaseConnection.getConnection();
				PreparedStatement stmt = connection.prepareStatement(singleQuery)) {
			System.out.println("Connection established for getUserCodeFiles (single files): " + connection);
			stmt.setInt(1, userId);
			try (ResultSet rs = stmt.executeQuery()) {
				while (rs.next()) {
					String encryptedCode = new String(rs.getBytes("code_content"));
					String decryptedFilename = AESUtil.decrypt(rs.getString("encrypted_filename"), aesKey, iv);
					String decryptedCode = AESUtil.decrypt(encryptedCode, aesKey, iv);
					codeFiles.add(new CodeFile(rs.getInt("file_id"), rs.getInt("user_id"), decryptedFilename,
							rs.getString("file_type"), rs.getInt("file_size"), decryptedCode,
							rs.getString("file_extension"), rs.getTimestamp("created_at"),
							rs.getTimestamp("updated_at")));
				}
			}
		} catch (SQLException e) {
			System.out.println("Database error fetching single files in getUserCodeFiles: " + e.getMessage());
		} catch (Exception e) {
			System.out.println("Encryption error fetching single files in getUserCodeFiles: " + e.getMessage());
		}

		String webQuery = "SELECT f.file_id, f.user_id, f.encrypted_filename, f.file_type, w.html_content, w.css_content, "
				+ "w.js_content, f.created_at, f.updated_at FROM files f "
				+ "JOIN web_project_contents w ON f.file_id = w.file_id WHERE f.user_id = ? AND f.file_type = 'web'";
		try (Connection connection = DatabaseConnection.getConnection();
				PreparedStatement stmt = connection.prepareStatement(webQuery)) {
			System.out.println("Connection established for getUserCodeFiles (web projects): " + connection);
			stmt.setInt(1, userId);
			try (ResultSet rs = stmt.executeQuery()) {
				while (rs.next()) {
					String decryptedHtml = rs.getBytes("html_content") != null
							? AESUtil.decrypt(new String(rs.getBytes("html_content")), aesKey, iv)
							: null;
					String decryptedCss = rs.getBytes("css_content") != null
							? AESUtil.decrypt(new String(rs.getBytes("css_content")), aesKey, iv)
							: null;
					String decryptedJs = rs.getBytes("js_content") != null
							? AESUtil.decrypt(new String(rs.getBytes("js_content")), aesKey, iv)
							: null;
					String decryptedFilename = AESUtil.decrypt(rs.getString("encrypted_filename"), aesKey, iv);
					codeFiles.add(new CodeFile(rs.getInt("file_id"), rs.getInt("user_id"), decryptedFilename,
							rs.getString("file_type"), decryptedHtml, decryptedCss, decryptedJs,
							rs.getTimestamp("created_at"), rs.getTimestamp("updated_at")));
				}
			}
		} catch (SQLException e) {
			System.out.println("Database error fetching web projects in getUserCodeFiles: " + e.getMessage());
		} catch (Exception e) {
			System.out.println("Encryption error fetching web projects in getUserCodeFiles: " + e.getMessage());
		}

		return codeFiles;
	}

	public CodeFile getCodeFile(int userId, String filename) {
		SecretKey aesKey;
		IvParameterSpec iv;
		try {
			aesKey = userDAO.getAESKeyByUserId(userId);
			iv = userDAO.getIVByUserId(userId);
		} catch (SQLException e) {
			System.out.println("Database error getting AES key/IV in getCodeFile: " + e.getMessage());
			return null;
		}
		String encryptedFilename;
		try {
			encryptedFilename = AESUtil.encrypt(filename, aesKey, iv);
		} catch (Exception e) {
			System.out.println("Encryption error encrypting filename in getCodeFile: " + e.getMessage());
			return null;
		}

		String singleQuery = "SELECT f.file_id, f.user_id, f.encrypted_filename, f.file_type, fc.file_size, fc.code_content, "
				+ "fc.file_extension, f.created_at, f.updated_at FROM files f "
				+ "JOIN file_contents fc ON f.file_id = fc.file_id "
				+ "WHERE f.user_id = ? AND f.encrypted_filename = ? AND f.file_type = 'single'";
		try (Connection connection = DatabaseConnection.getConnection();
				PreparedStatement stmt = connection.prepareStatement(singleQuery)) {
			System.out.println("Connection established for getCodeFile (single file): " + connection);
			stmt.setInt(1, userId);
			stmt.setString(2, encryptedFilename);
			try (ResultSet rs = stmt.executeQuery()) {
				if (rs.next()) {
					String encryptedCode = new String(rs.getBytes("code_content"));
					String decryptedFilename = AESUtil.decrypt(rs.getString("encrypted_filename"), aesKey, iv);
					String decryptedCode = encryptedCode != null ? AESUtil.decrypt(encryptedCode, aesKey, iv) : null;
					System.out.println("Fetched single file: " + decryptedFilename + " for userId: " + userId);
					return new CodeFile(rs.getInt("file_id"), rs.getInt("user_id"), decryptedFilename,
							rs.getString("file_type"), rs.getInt("file_size"), decryptedCode,
							rs.getString("file_extension"), rs.getTimestamp("created_at"),
							rs.getTimestamp("updated_at"));
				}
			}
		} catch (SQLException e) {
			System.out.println("Database error fetching single file in getCodeFile: " + e.getMessage());
		} catch (Exception e) {
			System.out.println("Encryption error fetching single file in getCodeFile: " + e.getMessage());
		}

		String webQuery = "SELECT f.file_id, f.user_id, f.encrypted_filename, f.file_type, w.html_content, w.css_content, "
				+ "w.js_content, f.created_at, f.updated_at FROM files f "
				+ "JOIN web_project_contents w ON f.file_id = w.file_id "
				+ "WHERE f.user_id = ? AND f.encrypted_filename = ? AND f.file_type = 'web'";
		try (Connection connection = DatabaseConnection.getConnection();
				PreparedStatement stmt = connection.prepareStatement(webQuery)) {
			System.out.println("Connection established for getCodeFile (web project): " + connection);
			stmt.setInt(1, userId);
			stmt.setString(2, encryptedFilename);
			try (ResultSet rs = stmt.executeQuery()) {
				if (rs.next()) {
					String encryptedHtml = rs.getBytes("html_content") != null ? new String(rs.getBytes("html_content"))
							: null;
					String encryptedCss = rs.getBytes("css_content") != null ? new String(rs.getBytes("css_content"))
							: null;
					String encryptedJs = rs.getBytes("js_content") != null ? new String(rs.getBytes("js_content"))
							: null;
					String decryptedFilename = AESUtil.decrypt(rs.getString("encrypted_filename"), aesKey, iv);
					return new CodeFile(rs.getInt("file_id"), rs.getInt("user_id"), decryptedFilename,
							rs.getString("file_type"),
							encryptedHtml != null ? AESUtil.decrypt(encryptedHtml, aesKey, iv) : null,
							encryptedCss != null ? AESUtil.decrypt(encryptedCss, aesKey, iv) : null,
							encryptedJs != null ? AESUtil.decrypt(encryptedJs, aesKey, iv) : null,
							rs.getTimestamp("created_at"), rs.getTimestamp("updated_at"));
				}
			}
		} catch (SQLException e) {
			System.out.println("Database error fetching web project in getCodeFile: " + e.getMessage());
		} catch (Exception e) {
			System.out.println("Encryption error fetching web project in getCodeFile: " + e.getMessage());
		}

		System.out.println("No file found with filename: " + filename + " for userId: " + userId);
		return null;
	}

	public boolean updateWebFile(int userId, String name, byte[] htmlContent, byte[] cssContent, byte[] jsContent) {
		try (Connection connection = DatabaseConnection.getConnection()) {
			connection.setAutoCommit(false);

			SecretKey aesKey = userDAO.getAESKeyByUserId(userId);
			IvParameterSpec iv = userDAO.getIVByUserId(userId);
			String encryptedFilename = AESUtil.encrypt(name, aesKey, iv);

			String selectSql = "SELECT file_id FROM files WHERE user_id = ? AND encrypted_filename = ?";
			int fileId;
			try (PreparedStatement selectStmt = connection.prepareStatement(selectSql)) {
				selectStmt.setInt(1, userId);
				selectStmt.setString(2, encryptedFilename);
				try (ResultSet rs = selectStmt.executeQuery()) {
					if (rs.next()) {
						fileId = rs.getInt("file_id");
					} else {
						connection.rollback();
						System.out.println("No file found to update: " + name);
						return false;
					}
					if (rs.next()) {
						connection.rollback();
						System.out.println("Multiple files found for: " + name);
						return false;
					}
				}
			}

			String updateContentSql = "UPDATE web_project_contents SET html_content = ?, css_content = ?, js_content = ? WHERE file_id = ?";
			try (PreparedStatement contentStmt = connection.prepareStatement(updateContentSql)) {
				contentStmt.setBytes(1,
						htmlContent != null ? AESUtil.encrypt(new String(htmlContent), aesKey, iv).getBytes() : null);
				contentStmt.setBytes(2,
						cssContent != null ? AESUtil.encrypt(new String(cssContent), aesKey, iv).getBytes() : null);
				contentStmt.setBytes(3,
						jsContent != null ? AESUtil.encrypt(new String(jsContent), aesKey, iv).getBytes() : null);
				contentStmt.setInt(4, fileId);
				int rowsAffected = contentStmt.executeUpdate();
				if (rowsAffected == 0) {
					connection.rollback();
					System.out.println("No web project content found to update for file_id: " + fileId);
					return false;
				}
			}

			connection.commit();
			System.out.println("Web project updated: " + name);
			return true;
		} catch (SQLException e) {
			System.out.println("SQLException in updateWebFile: " + e.getMessage());
			return false;
		} catch (Exception e) {
			System.out.println("Error in updateWebFile: " + e.getMessage());
			return false;
		}
	}

	public boolean updateCodeFile(int userId, String filename, String newCode) {
		Connection connection = null;
		try {
			connection = DatabaseConnection.getConnection();
			System.out.println("Connection established for updateCodeFile: " + connection);
			SecretKey aesKey = userDAO.getAESKeyByUserId(userId);
			IvParameterSpec iv = userDAO.getIVByUserId(userId);
			String encryptedFilename = AESUtil.encrypt(filename, aesKey, iv);
			String encryptedNewCode = AESUtil.encrypt(newCode, aesKey, iv);

			String query = "UPDATE file_contents fc JOIN files f ON fc.file_id = f.file_id "
					+ "SET fc.code_content = ?, f.updated_at = CURRENT_TIMESTAMP "
					+ "WHERE f.user_id = ? AND f.encrypted_filename = ? AND f.file_type = 'single'";
			try (PreparedStatement stmt = connection.prepareStatement(query)) {
				System.out.println("Preparing update statement for filename: " + filename);
				stmt.setBytes(1, encryptedNewCode.getBytes());
				stmt.setInt(2, userId);
				stmt.setString(3, encryptedFilename);
				int rowsAffected = stmt.executeUpdate();
				System.out.println("Rows affected in updateCodeFile: " + rowsAffected);
				return rowsAffected > 0;
			}
		} catch (SQLException e) {
			System.out.println("Database error in updateCodeFile: " + e.getMessage());
			return false;
		} catch (Exception e) {
			System.out.println("Encryption error in updateCodeFile: " + e.getMessage());
			return false;
		} finally {
			closeConnection(connection);
		}
	}

	public boolean deleteProject(int userId, String name) {
		try (Connection connection = DatabaseConnection.getConnection()) {
			System.out.println("Connection established for deleteProject: " + connection);
			connection.setAutoCommit(false);

			SecretKey aesKey = userDAO.getAESKeyByUserId(userId);
			IvParameterSpec iv = userDAO.getIVByUserId(userId);
			String encryptedFilename = AESUtil.encrypt(name, aesKey, iv);
			System.out.println("Encrypted filename for deletion: " + encryptedFilename);

			String deleteFileSql = "DELETE FROM files WHERE user_id = ? AND encrypted_filename = ?";
			try (PreparedStatement deleteFileStmt = connection.prepareStatement(deleteFileSql)) {
				deleteFileStmt.setInt(1, userId);
				deleteFileStmt.setString(2, encryptedFilename);
				int rowsAffected = deleteFileStmt.executeUpdate();
				System.out.println("Rows deleted from files table: " + rowsAffected);
				if (rowsAffected == 0) {
					System.out.println("Failed to delete from files table or project not found");
					connection.rollback();
					return false;
				}
			}

			connection.commit();
			System.out.println("Transaction committed successfully for deleteProject: " + name);
			return true;
		} catch (SQLException e) {
			System.out.println("SQLException in deleteProject: " + e.getMessage());
			return false;
		} catch (Exception e) {
			System.out.println("Encryption error in deleteProject: " + e.getMessage());
			return false;
		}
	}

	public boolean renameFile(int userId, String oldName, String newName) {
	    Connection connection = null;
	    try {
	        connection = DatabaseConnection.getConnection();
	        connection.setAutoCommit(false);

	        SecretKey aesKey = userDAO.getAESKeyByUserId(userId);
	        IvParameterSpec iv = userDAO.getIVByUserId(userId);
	        String encryptedOldName = AESUtil.encrypt(oldName, aesKey, iv);
	        String encryptedNewName = AESUtil.encrypt(newName, aesKey, iv);

	        // Check if new name already exists
	        if (isFilenameExists(connection, userId, newName)) {
	            System.out.println("New filename already exists: " + newName);
	            connection.rollback();
	            return false;
	        }

	        String updateSql = "UPDATE files SET encrypted_filename = ? WHERE user_id = ? AND encrypted_filename = ?";
	        try (PreparedStatement stmt = connection.prepareStatement(updateSql)) {
	            stmt.setString(1, encryptedNewName);
	            stmt.setInt(2, userId);
	            stmt.setString(3, encryptedOldName);
	            int rowsAffected = stmt.executeUpdate();
	            if (rowsAffected == 0) {
	                connection.rollback();
	                System.out.println("No file found to rename from " + oldName + " to " + newName);
	                return false;
	            }
	        }

	        connection.commit();
	        System.out.println("File renamed from " + oldName + " to " + newName);
	        return true;
	    } catch (SQLException e) {
	        System.err.println("SQLException in renameFile: " + e.getMessage());
	        if (connection != null) rollback(connection);
	        e.printStackTrace();
	        return false;
	    } catch (Exception e) {
	        System.err.println("Error in renameFile: " + e.getMessage());
	        if (connection != null) rollback(connection);
	        e.printStackTrace();
	        return false;
	    }
	}
	
	private void rollback(Connection connection) {
		if (connection != null) {
			try {
				System.out.println("Rolling back transaction");
				connection.rollback();
				System.out.println("Transaction rolled back");
			} catch (SQLException e) {
				System.out.println("Failed to rollback transaction: " + e.getMessage());
			}
		}
	}

	private void closeConnection(Connection connection) {
		if (connection != null) {
			try {
				connection.setAutoCommit(true);
				connection.close();
				System.out.println("Database connection closed successfully");
			} catch (SQLException e) {
				System.out.println("Failed to close database connection: " + e.getMessage());
			}
		}
	}
}