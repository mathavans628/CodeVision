// components/auth/ForgotPasswordForm.jsx
import { useState } from "react";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";
import { validateField } from "../../utils/validation";
import LoginFetch from "../../Fetch/LoginFetch";
import { Mail, Lock, ShieldQuestion } from "lucide-react";

const ForgotPasswordForm = ({ onBack, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        securityQuestion: "",
        securityAnswer: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message,setMessage] = useState("");
    const[open,setOpen] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validateStep1 = async () => {
        const emailError = validateField('email', formData);
        
        if (emailError) {
            setErrors({ email: emailError });
            return;
        }
        
        setLoading(true);
        try {
            const response = await LoginFetch({ email: formData.email }, 'check-email');
            if (response.success) {
                setFormData(prev => ({
                    ...prev,
                    securityQuestion: response.securityQuestion
                }));
                setStep(2);
            } else {
                setErrors({ email: "Email not found" });
            }
        } catch (error) {
            setErrors({ email: "Error verifying email" });
        }
        setLoading(false);
    };

    const validateStep2 = async () => {
        if (!formData.securityAnswer) {
            setErrors({ securityAnswer: "Security answer is required" });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await LoginFetch({
                email: formData.email,
                securityAnswer: formData.securityAnswer
            }, 'verify-security');
            
            if (response.success) {
                setStep(3);
            } else {
                setErrors({ securityAnswer: "Incorrect security answer" });
            }
        } catch (error) {
            setErrors({ securityAnswer: "Error verifying answer" });
        }
        setLoading(false);
    };

    const handleResetPassword = async () => {
        const passwordError = validateField('password', { password: formData.newPassword });
        const confirmError = validateField('confirmPassword', { 
            password: formData.newPassword, 
            confirmPassword: formData.confirmPassword 
        });

        if (passwordError || confirmError) {
            setErrors({
                newPassword: passwordError,
                confirmPassword: confirmError
            });
            return;
        }

        setLoading(true);
        try {
            const response = await LoginFetch({
                email: formData.email,
                newPassword: formData.newPassword
            }, 'change-password');
            
            if (response.success) {
                // alert("Password reset successfully!");
                setMessage("Password reset successfully!");
                setOpen(true);
                onSuccess?.();
            } else {
                setErrors({ newPassword: "Error resetting password" });
            }
        } catch (error) {
            setErrors({ newPassword: "Error resetting password" });
        }
        setLoading(false);
    };

    return (
        
        <div className="space-y-4">
            {open && <SingleButtonPopup open={open} onClose={() => setOpen(false)} message={message} />}
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="text-blue-500 hover:text-blue-600  cursor-pointer">
                    ← Back to Login
                </button>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>

            {step === 1 && (
                <>
                    <TextInput
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        error={errors.email}
                        Icon={Mail}
                    />

                    <button onClick={validateStep1} disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                        {loading ? "Verifying..." : "Continue"}
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-gray-700">Security Question:</p>
                        <p className="font-medium">{formData.securityQuestion}</p>
                    </div>

                    <TextInput
                        type="text"
                        placeholder="Enter your answer"
                        value={formData.securityAnswer}
                        onChange={(e) => handleInputChange("securityAnswer", e.target.value)}
                        error={errors.securityAnswer}
                        Icon={ShieldQuestion}
                    />

                    <button onClick={validateStep2} disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                        {loading ? "Verifying..." : "Verify Answer"}
                    </button>
                </>
            )}

            {step === 3 && (
                <>
                    <PasswordInput
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        error={errors.newPassword}
                        Icon={Lock}
                    />

                    <PasswordInput
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        error={errors.confirmPassword}
                        Icon={Lock}
                    />

                    <button onClick={handleResetPassword} disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </>
            )}
        </div>
    );
};

export default ForgotPasswordForm;