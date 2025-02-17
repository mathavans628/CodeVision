import { useState } from "react";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import { validateField } from "../../utils/validation";
import LoginFetch from "../../Fetch/LoginFetch";
import SecurityQuestionDropdown from "./SecurityQuestionDropdown";
import { Mail, User, ShieldCheck } from "lucide-react";

const SignupForm = ({ switchMode }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: validateField(field, { ...formData, [field]: value }) }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const newErrors = {};
        let hasErrors = false;

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
            const response = await LoginFetch(formData, "signup");
            if (response.message === "User already exists with this email.") {
                setErrors(prev => ({ ...prev, email: response.message }));
            }            
                
            alert(response.success ? "Account created successfully!" : response.message);
        } catch (error) {
            alert("Error connecting to the server!");
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
                <button className="text-blue-500 font-medium hover:underline cursor-pointer" onClick={switchMode}>Login</button>
            </p>
        </div>
    );
};

export default SignupForm;