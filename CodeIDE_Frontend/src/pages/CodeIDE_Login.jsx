import { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import Logo from "../assets/CodeAiD_Final_Logo_WithoutBG.png"

function CodeIDE_Login({ setIsAuthenticated, mode = "login" }) {
    const [isLogin, setIsLogin] = useState(mode === "login");

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white">
            <motion.div
                className="w-full lg:w-1/2 bg-blue-50 flex items-center justify-center p-8 lg:p-0 min-h-[200px] lg:min-h-screen"
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">
                        <img src={Logo} alt="" />
                    </div>
                    <p className="text-blue-600 text-3xl md:text-2xl text-center max-w-md">
                        Empowering your Coding Journey!
                    </p>
                </div>
            </motion.div>

            <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-6 lg:p-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 cursor-pointer">
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm md:text-base rounded-md transition-all duration-300 cursor-pointer ${
                                isLogin
                                    ? "bg-white shadow-sm text-gray-900"
                                    : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm md:text-base rounded-md transition-all duration-300 cursor-pointer ${
                                !isLogin
                                    ? "bg-white shadow-sm text-gray-900"
                                    : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

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