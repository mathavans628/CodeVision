const LoginFetch = async (formData, action) => {
    console.log("===> "+ action);
    
    let endpoint;
    if (action === "login") {
        endpoint = "http://localhost:8080/CodeVision/LoginServlet";
    }
    else if (action === "signup") {
        endpoint = "http://localhost:8080/CodeVision/SignupServlet";
    }
    else if (action === "check-email") {
        endpoint = "http://localhost:8080/CodeVision/CheckEmailServlet";
    }
    else if (action === "verify-security") {  
        endpoint = "http://localhost:8080/CodeVision/VerifySecurityServlet";
    } 
    else if (action === "change-password") {  
        endpoint = "http://localhost:8080/CodeVision/ResetPasswordServlet";
    } 
    else {
        throw new Error("Invalid action");
    }

    console.log(endpoint);
    
    
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response Data:", data);
        return data;
    } catch (error) {
        console.error("Fetch Error:", error);
        return { success: false, message: "Failed to connect to the server." };
    }
};

export default LoginFetch;