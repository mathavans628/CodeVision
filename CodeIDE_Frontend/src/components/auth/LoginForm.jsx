import React, { useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { validateField } from "../../utils/validation";
import LoginFetch from "../../Fetch/LoginFetch";
import { useNavigate } from "react-router-dom";
import checkAuth from "./checkAuth";
import SingleButtonPopup from "../../NoButtonPopup";

const LoginForm = ({ setIsAuthenticated, switchMode }) => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const[open,setOpen] = useState(false);

    const navigate = useNavigate();

    const waitForPopupClose = () => {
        return new Promise((resolve) => {
          const checkPopup = setInterval(() => {
            if (!open) {
              clearInterval(checkPopup);
              resolve();
            }
          }, 600); // Check every 100ms
        });
      };
      


    useEffect(() => {
        console.log("Updated open state:", open);
      }, [open]);
      
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Validate with the latest value
        const errorMessage = validateField(field, { ...formData, [field]: value }, true);
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        
        const emailError = validateField("email", formData, true);
        const passwordError = validateField("password", formData, true);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            setLoading(false);
            return;
        }

        try {
            const response = await LoginFetch(formData, "login");
            console.log("Login Response:", response);
    
            if (response.success) 
            {
                // alert("Logged in successfully!");
                setOpen(true);
                await waitForPopupClose();
                const authStatus = await checkAuth();
    
                if (authStatus.isAuthenticated) 
                {
                    setIsAuthenticated(true);
                    navigate("/main", { replace: true }); 
                }
                else
                {
                    setErrors({ email: "Authentication failed. Please log in again.",
                                password: "Authentication failed. Please log in again." });
                }
            } 
            else
            {
                setErrors({ email: response.message || "Invalid credentials",
                            password: response.message || "Invalid credentials"});
            }
        } 
        catch (error)
        {
            setErrors({ email: "Network error. Please try again." });
            console.error("Login error:", error);
        }

        setLoading(false);
    };

    if (showForgotPassword) {
        return (
            <ForgotPasswordForm 
                onBack={() => setShowForgotPassword(false)}
                onSuccess={() => setShowForgotPassword(false)}
            />
        );
    }

    return (
        <div className="space-y-4">
            <TextInput
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                Icon={Mail}
            />
            
            <PasswordInput
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={errors.password}
                Icon={Lock}
            />

            <div className="flex justify-end">
                <button
                    className="text-blue-500 hover:text-blue-600 text-sm cursor-pointer"
                    onClick={() => setShowForgotPassword(true)}
                >
                    Forgot password?
                </button>
            </div>

            <button
                disabled={loading}
                className={`w-full p-2 rounded-lg cursor-pointer transition 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                onClick={handleSubmit}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-sm">
                New user?    <button className="text-blue-500 cursor-pointer" onClick={switchMode}>Sign up</button>
            </p>
            {open && <SingleButtonPopup open={open} onClose={() => setOpen(false)} message={"Logged in successfully!"}/>}
        </div>
    );
};

export default LoginForm;