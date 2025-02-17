import { useState, useRef, useEffect } from "react";
import { ShieldQuestion, ChevronDown, AlertCircle } from "lucide-react";

const securityQuestions = [
    "What was the name of your pet?",
    "What was your first school's name?",
    "What city were you born in?",
    "What is your childhood nickname?",
    "Who was your childhood hero?",
    "What is your best friend's name?",
];

const SecurityQuestionDropdown = ({ formData, setFormData, errors }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (value) => {
        setFormData((prev) => ({ ...prev, securityQuestion: value }));
        setIsOpen(false); // Hide dropdown on selection
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border h-12 text-gray-700 bg-white
                    focus:outline-none focus:ring-2 transition-all duration-300 text-left not-[]:cursor-pointer
                    ${errors.securityQuestion ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
            >
                <ShieldQuestion className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                {formData.securityQuestion ? (
                    <span>{formData.securityQuestion}</span>
                ) : (
                    <span className="text-gray-400">Select a security question</span>
                )}
                <ChevronDown
                    className={`absolute right-3 top-3 w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                    {securityQuestions.map((question, index) => (
                        <div
                            key={index}
                            onClick={() => handleInputChange(question)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            {question}
                        </div>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {errors.securityQuestion && (
                <p className="flex items-center text-red-500 text-xs md:text-sm mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.securityQuestion}
                </p>
            )}
        </div>
    );
};

export default SecurityQuestionDropdown;