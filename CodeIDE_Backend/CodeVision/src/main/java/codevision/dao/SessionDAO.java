package codevision.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import codevision.util.DatabaseConnection;

public class SessionDAO {

    // ✅ CREATE SESSION
    public boolean createSession(String sessionId, int userId, Timestamp expiryTime) {
        String sql = "INSERT INTO sessions (session_id, user_id, login_time, expiry_time) VALUES (?, ?, NOW(), ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, sessionId);
            stmt.setInt(2, userId);
            stmt.setTimestamp(3, expiryTime);

            int rowsInserted = stmt.executeUpdate();
            if (rowsInserted > 0) {
                System.out.println("🟢 Session stored in DB: " + sessionId);
                return true;
            }
        } catch (SQLException e) {
            System.out.println("❌ Error storing session: " + e.getMessage());
        }
        return false;
    }

    // ✅ CHECK SESSION EXISTS
    public boolean isSessionValid(String sessionId) {
        String sql = "SELECT session_id FROM sessions WHERE session_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, sessionId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                System.out.println("✅ Valid session found: " + rs.getString("session_id"));
                return true;
            } else {
                System.out.println("⚠️ No valid session found for: " + sessionId);
            }
        } catch (SQLException e) {
            System.out.println("❌ Error checking session: " + e.getMessage());
        }
        return false;
    }

    // ✅ DELETE SESSION (Updated to Remove Expired Sessions)
    public boolean deleteSession(String sessionId) {
        // 🔍 Check if session exists
        String checkSQL = "SELECT session_id FROM sessions WHERE session_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement checkStmt = conn.prepareStatement(checkSQL)) {

            checkStmt.setString(1, sessionId);
            ResultSet rs = checkStmt.executeQuery();

            if (!rs.next()) {
                System.out.println("⚠️ Session not found in DB: " + sessionId);
                return false;
            } else {
                System.out.println("✅ Found session: " + rs.getString("session_id"));
            }
        } catch (SQLException e) {
            System.out.println("❌ Error checking session: " + e.getMessage());
        }

        // 🔥 If session exists, proceed with deletion
        String deleteSQL = "DELETE FROM sessions WHERE session_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement deleteStmt = conn.prepareStatement(deleteSQL)) {

            deleteStmt.setString(1, sessionId);
            int rowsDeleted = deleteStmt.executeUpdate();
            System.out.println("🟢 Delete Query Executed for Session: " + sessionId + " | Rows Deleted: " + rowsDeleted);

            return rowsDeleted > 0;
        } catch (SQLException e) {
            System.out.println("❌ Error deleting session: " + e.getMessage());
        }
        return false;
    }
}