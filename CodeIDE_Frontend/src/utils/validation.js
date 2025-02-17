// utils/validation.js
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validateField = (field, formData, isLogin = false) => {
    if (isLogin) 
        {
        switch (field) 
        {
            case 'email':
                if (!formData.email) return "Email is required";
                return emailPattern.test(formData.email) ? "" : "Enter a valid email";
            case 'password':
                return formData.password ? "" : "Password is required";
            default:
                return "";
        }
    }

    switch (field) 
    {
        case 'name':
            return formData.name ? "" : "Name is required";
        case 'email':
            if (!formData.email) return "Email is required";
            return emailPattern.test(formData.email) ? "" : "Enter a valid email";
        case 'password':
            if (!formData.password) return "Password is required";
            return passwordPattern.test(formData.password) 
                ? "" 
                : "Password must be 8+ characters with uppercase, symbol & number";
        case 'confirmPassword':
            if (!formData.confirmPassword) return "Confirm password is required";
            return formData.password === formData.confirmPassword 
                ? "" 
                : "Passwords do not match";
        case 'securityQuestion':
            return formData.securityQuestion ? "" : "Security question is required";
        case 'securityAnswer':
            return formData.securityAnswer ? "" : "Security answer is required";
        default:
            return "";
    }
};