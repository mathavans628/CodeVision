import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from "lucide-react";

function CodeIDE_Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [focusedField, setFocusedField] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: ""
    });

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validateField = (field) => {
        switch (field) {
            case 'name':
                if (!formData.name && !isLogin) return "Name is required";
                break;
            case 'email':
                if (!formData.email) return "Email is required";
                if (!emailPattern.test(formData.email)) return "Enter a valid email";
                break;
            case 'password':
                if (!formData.password) return "Password is required";
                if (!passwordPattern.test(formData.password)) 
                    return "Password must be 8+ characters with uppercase, symbol & number";
                break;
            case 'confirmPassword':
                if (!formData.confirmPassword && !isLogin) return "Confirm password is required";
                if (formData.password !== formData.confirmPassword && !isLogin) 
                    return "Passwords do not match";
                break;
            case 'securityQuestion':
                if (!formData.securityQuestion && !isLogin) return "Security question is required";
                break;
            case 'securityAnswer':
                if (!formData.securityAnswer && !isLogin) return "Security answer is required";
                break;
            default:
                return "";
        }
        return "";
    };

    const handleSubmit = () => {
        const newErrors = {};
        let hasErrors = false;
        const fieldsToValidate = isLogin ? ['email', 'password'] : Object.keys(formData);

        fieldsToValidate.forEach(field => {
            const error = validateField(field);
            if (error) {
                newErrors[field] = error;
                hasErrors = true;
            }
        });

        setErrors(newErrors);

        if (!hasErrors) {
            alert(isLogin ? "Logged in successfully!" : "Account created successfully!");
        }
    };

    const securityQuestions = [
        "What was the name of your pet?",
        "What was your first school's name?",
        "What city were you born in?",
        "What is your childhood nickname?",
        "Who was your childhood hero?",
        "What is your best friend's name?",
    ];

    const getInputClassName = (fieldName) => `
        w-full px-4 py-2 rounded-lg
        border ${focusedField === fieldName ? 'border-blue-500 ring-2 ring-blue-400' : 'border-gray-300'} 
        ${errors[fieldName] ? 'border-red-500' : ''}
        text-gray-700 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-400 
        focus:border-blue-400 transition-all duration-300
        h-12 bg-white
    `;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white">
            {/* Logo Section - Full width on mobile, half on desktop */}
            <div className="w-full lg:w-1/2 bg-blue-50 flex items-center justify-center p-8 lg:p-0 min-h-[200px] lg:min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">
                        Your Logo Here
                    </div>
                    <p className="text-blue-600 text-lg md:text-xl text-center max-w-md">
                        Your development journey starts here
                    </p>
                </div>
            </div>

            {/* Form Section - Full width on mobile, half on desktop */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-6 lg:p-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                    {/* Form Switch Buttons */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm md:text-base rounded-md transition-all duration-300 
                            ${isLogin ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm md:text-base rounded-md transition-all duration-300 
                            ${!isLogin ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h1 className="text-xl md:text-2xl font-bold mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base mb-6">
                        {isLogin ? 'Login to continue coding' : 'Begin your development journey'}
                    </p>

                    <div className="space-y-4">
                        {!isLogin && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    onFocus={() => setFocusedField("name")}
                                    onBlur={() => setFocusedField("")}
                                    className={getInputClassName("name")}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.name}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField("")}
                                className={getInputClassName("email")}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "password" : "text"}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField("")}
                                    className={getInputClassName("password")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {!isLogin && (
                            <>
                                <div>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "password" : "text"}
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            onFocus={() => setFocusedField("confirmPassword")}
                                            onBlur={() => setFocusedField("")}
                                            className={getInputClassName("confirmPassword")}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-gray-500"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <select
                                            value={formData.securityQuestion}
                                            onChange={(e) => handleInputChange('securityQuestion', e.target.value)}
                                            onFocus={() => setFocusedField("securityQuestion")}
                                            onBlur={() => setFocusedField("")}
                                            className={`${getInputClassName("securityQuestion")} appearance-none`}
                                        >
                                            <option value="">Select a security question</option>
                                            {securityQuestions.map((question, index) => (
                                                <option key={index} value={question}>
                                                    {question}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.securityQuestion && (
                                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.securityQuestion}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter your security answer"
                                        value={formData.securityAnswer}
                                        onChange={(e) => handleInputChange('securityAnswer', e.target.value)}
                                        onFocus={() => setFocusedField("securityAnswer")}
                                        onBlur={() => setFocusedField("")}
                                        className={getInputClassName("securityAnswer")}
                                    />
                                    {errors.securityAnswer && (
                                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.securityAnswer}</p>
                                    )}
                                </div>
                            </>
                        )}

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-500 text-white text-lg md:text-xl font-semibold px-6 py-3 rounded-lg
                            hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 
                            transition-all duration-300 shadow-md mt-6"
                        >
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>

                        <p className="text-center text-gray-600 text-sm md:text-base mt-4">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-500 hover:text-blue-600 font-medium"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodeIDE_Login;