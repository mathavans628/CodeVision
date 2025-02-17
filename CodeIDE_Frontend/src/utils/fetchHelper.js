const LoginFetch = async (formData, isLogin) => {
    console.log(formData + isLogin);
    
    const url = isLogin ? "/api/login" : "/api/signup";
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    };

    try {
        const response = await fetch(url, options);
        console.log(response);
        
        return await response.json();
    } catch (error) {
        return { success: false, message: "Server connection failed" };
    }
};

export default LoginFetch;