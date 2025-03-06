import { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import Logo from "../assets/CodeAiD_Final_Logo_WithoutBG.png";
import { useNavigate } from "react-router-dom";

function CodeIDE_Login({ setIsAuthenticated, mode = "login" }) {
    const [isLogin, setIsLogin] = useState(mode === "login");
    const navigate = useNavigate();

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white">
            {/* Left Side (Logo & Text) */}
            <motion.div
                className="w-full lg:w-1/2 bg-[#FBFBFB] flex items-center justify-center p-8 lg:p-0 min-h-[200px] lg:min-h-screen"
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">
                        <img src={Logo} alt="CodeAiD Logo" />
                    </div>
                    <p className="text-blue-600 text-3xl md:text-2xl text-center max-w-md">
                        Empowering your Coding Journey!
                    </p>
                </div>
            </motion.div>

            {/* Right Side (Auth Form) */}
            <div className="w-full lg:w-1/2 flex bg-[#81BFDA] justify-center items-center p-4 md:p-6 lg:p-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 cursor-pointer">
                    {/* Navigation Buttons */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => {
                                navigate("/login");
                                setIsLogin(true);
                            }}
                            className={`flex-1 py-2 text-sm md:text-base rounded-md transition-all duration-300 cursor-pointer ${
                                isLogin
                                    ? "bg-white shadow-sm text-gray-900"
                                    : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                navigate("/signup");
                                setIsLogin(false);
                            }}
                            className={`flex-1 py-2 text-sm md:text-base rounded-md transition-all duration-300 cursor-pointer ${
                                !isLogin
                                    ? "bg-white shadow-sm text-gray-900"
                                    : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            Sign up
                        </button>
                    </div>

                    {/* Login / Signup Form */}
                    {isLogin ? (
                        <LoginForm setIsAuthenticated={setIsAuthenticated} switchMode={() => setIsLogin(false)} />
                    ) : (
                        <SignupForm setIsAuthenticated={setIsAuthenticated} switchMode={() => setIsLogin(true)} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default CodeIDE_Login;