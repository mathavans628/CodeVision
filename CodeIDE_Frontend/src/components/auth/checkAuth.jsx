const checkAuth = async () => {
    try {
        const response = await fetch("http://localhost:8080/CodeVision/CheckAuthServlet", {
            method: "GET",
            credentials: "include",  
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Authentication check failed.");
        }

        const data = await response.json();

        return { isAuthenticated: data.success };  
    } catch (error) {
        console.error("Failed to check authentication:", error);
        return { isAuthenticated: false };
    }
};

export default checkAuth;