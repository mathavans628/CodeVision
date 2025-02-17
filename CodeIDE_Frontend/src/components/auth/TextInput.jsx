import React from "react";
import { AlertCircle } from "lucide-react";

const TextInput = ({ 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    error, 
    Icon 
}) => {
    return (
        <div className="relative w-full">
            {/* Dynamic Icon */}
            {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />}
            
            {/* Input Field */}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border h-12 text-gray-700 placeholder-gray-400 bg-white
                    focus:outline-none focus:ring-2 transition-all duration-300
                    ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                aria-invalid={!!error}
            />

            {/* Error Message */}
            {error && (
                <p className="flex items-center text-red-500 text-xs md:text-sm mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" /> {error}
                </p>
            )}
        </div>
    );
};

export default TextInput;