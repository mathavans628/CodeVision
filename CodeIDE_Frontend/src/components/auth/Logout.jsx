import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                const response = await fetch("http://localhost:8080/CodeVision/LogoutServlet", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Server error");
                }

                console.log("Logout successful:", data.message);

                Cookies.remove("auth_token", { path: "/" }); // Changed to match servlet cookie name

                setIsAuthenticated(false);
                navigate("/login", { replace: true });

            } catch (error) {
                console.error("Logout failed:", error.message);
                // Only show alert for unexpected errors, not "No active session"
                if (error.message !== "No active session") {
                    alert(`Logout failed: ${error.message}`);
                }
            }
        };

        logoutUser();
    }, [navigate, setIsAuthenticated]);

    return null;
};

export default Logout;