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
        const isMultipart = action === "signup"; // Add other multipart actions if needed
        const requestOptions = {
            method: "POST",
            credentials: "include",
            body: isMultipart ? formData : JSON.stringify(formData),
        };

        if (!isMultipart) {
            requestOptions.headers = {
                "Content-Type": "application/json",
            };
        } // No Content-Type for FormData - browser sets multipart/form-data automatically

        const response = await fetch(endpoint, requestOptions);
        console.log("Response Status:", response.status);

        const text = await response.text();
        console.log("Raw Response Text:", text);

        const data = text ? JSON.parse(text) : null;
        console.log("Response Data:", data);

        return data || { success: false, message: "Empty response from server" };
    } catch (error) {
        console.error("Fetch Error:", error);
        return { success: false, message: "Network error. Please try again." };
    }
};

export default LoginFetch;