const LoginFetch = async (formData, action) => {
    console.log("===> Action:", action);

    const endpoints = {
        login: "http://localhost:8080/CodeVision/LoginServlet",
        signup: "http://localhost:8080/CodeVision/SignupServlet",
        "check-email": "http://localhost:8080/CodeVision/CheckEmailServlet",
        "verify-security": "http://localhost:8080/CodeVision/VerifySecurityServlet",
        "change-password": "http://localhost:8080/CodeVision/ResetPasswordServlet",
    };

    const endpoint = endpoints[action];

    if (!endpoint) {
        console.error("Invalid action:", action);
        return { success: false, message: "Invalid action" };
    }

    console.log("API Endpoint:", endpoint);

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include", // Ensure cookies are sent and received
        });

        console.log("Response Status:", response.status);

        const text = await response.text();
        console.log("Raw Response Text:", text); // Debugging

        const data = text ? JSON.parse(text) : null; // Parse JSON safely
        console.log("Response Data:", data);

        return data || { success: false, message: "Empty response from server" };
    } catch (error) {
        console.error("Fetch Error:", error);
        return { success: false, message: "Network error. Please try again." };
    }
};

export default LoginFetch;