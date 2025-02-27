import { useState } from "react";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

const PasswordInput = ({ value, onChange, placeholder, error }) => {
    const [showPassword, setShowPassword] = useState(true);

    return (
        <div className="w-full">
            {/* Input Container */}
            <div className="relative flex items-center w-full">
                {/* Lock Icon */}
                <Lock className="absolute left-3 text-gray-400 w-5 h-5" />

                {/* Password Input Field */}
                <input
                    type={showPassword ? "password" : "text"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                        error ? "border-red-500" : "border-gray-300"
                    } text-gray-700 placeholder-gray-400 focus:outline-none 
                    focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                    transition-all duration-300 h-12 bg-white`}
                />

                {/* Eye/EyeOff Toggle Button */}
                <button
                    type="button"
                    className="absolute right-3 flex items-center text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {error && (
                <p className="flex items-center text-red-500 text-xs md:text-sm mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" /> {error}
                </p>
            )}
        </div>
    );
};

export default PasswordInput;