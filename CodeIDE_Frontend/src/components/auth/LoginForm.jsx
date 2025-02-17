// Update the LoginForm.jsx to add the forgot password link
import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { validateField } from "../../utils/validation";
import LoginFetch from "../../Fetch/LoginFetch";

const LoginForm = ({ switchMode }) => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: validateField(field, formData, true) }));
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
            if (response.success) {
                alert("Logged in successfully!");
            } else {
                alert(response.message || "Login failed!");
            }
        } catch (error) {
            alert("Error connecting to the server!");
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
                className="w-full bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
                onClick={handleSubmit}
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm">
                New user? <button className="text-blue-500 cursor-pointer" onClick={switchMode}>Sign Up</button>
            </p>
        </div>
    );
};

export default LoginForm;