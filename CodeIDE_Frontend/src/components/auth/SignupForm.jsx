import { useState } from "react";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import { validateField } from "../../utils/validation";
import SignupFetch from "../../Fetch/LoginFetch"; // Renamed for clarity (create this if needed)
import SecurityQuestionDropdown from "./SecurityQuestionDropdown";
import { Mail, User, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import checkAuth from "./checkAuth";

const SignupForm = ({ setIsAuthenticated, switchMode }) => { 
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: ""
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const updatedFormData = { ...prev, [field]: value };
            setErrors(prevErrors => ({
                ...prevErrors,
                [field]: validateField(field, updatedFormData)
            }));
            return updatedFormData;
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const newErrors = {};
        let hasErrors = false;
    
        // Client-side validation
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData);
            if (error) {
                newErrors[field] = error;
                hasErrors = true;
            }
        });
    
        if (hasErrors) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }
    
        try {
            const response = await SignupFetch(formData, "signup");
            console.log("Signup Response:", response);
    
            if (response.message === "User already exists with this email.") {
                setErrors({ email: response.message });
                setLoading(false);
                return;
            }
    
            if (response.success) {
                alert("Account created successfully!");
                const authStatus = await checkAuth();
                console.log("Auth Check:", authStatus);
                console.log("Is Authenticated:", authStatus.isAuthenticated);
    
                if (authStatus.isAuthenticated) {
                    setIsAuthenticated(true);
                    navigate("/main", { replace: true });
                } else {
                    // User-friendly alert
                    alert("Your account was created, but we couldn’t log you in automatically. Please log in with your new credentials.");
                }
            } else {
                setErrors({ email: response.message || "Signup failed!" });
            }
        } catch (error) {
            setErrors({ email: "Error connecting to the server!" });
            console.error("Signup error:", error);
        }
    
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            {/* Name Input */}
            <TextInput
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={errors.name}
                Icon={User}
            />

            {/* Email Input */}
            <TextInput
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                Icon={Mail}
            />

            {/* Password Input */}
            <PasswordInput
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={errors.password}
            />

            {/* Confirm Password Input */}
            <PasswordInput
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
            />

            {/* Security Question Dropdown */}
            <SecurityQuestionDropdown
                formData={formData}
                setFormData={setFormData}
                errors={errors}
            />

            {/* Security Answer Input */}
            <TextInput
                type="text"
                placeholder="Security Answer"
                value={formData.securityAnswer}
                onChange={(e) => handleInputChange("securityAnswer", e.target.value)}
                error={errors.securityAnswer}
                Icon={ShieldCheck}
            />

            {/* Sign Up Button */}
            <button
                disabled={loading}
                className="w-full bg-blue-500 text-white p-3 rounded-lg flex justify-center items-center transition duration-300 hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer"
                onClick={handleSubmit}
            >
                {loading ? "Creating account..." : "Sign Up"}
            </button>

            {/* Switch to Login */}
            <p className="text-center text-sm">
                Already have an account?{" "}
                <button className="text-blue-500 font-medium hover:underline cursor-pointer" onClick={switchMode}>
                    Login
                </button>
            </p>
        </div>
    );
};

export default SignupForm;