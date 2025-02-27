// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CodeIDE_Login from "./pages/CodeIDE_Login";
import CodeIDE_Main from "./CodeIDE_Main";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Logout from "./components/auth/Logout";
import checkAuth from "./components/auth/checkAuth";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const checkAuthStatus = async () =>
        {
            try 
            {
                console.log(document.cookie.includes("is_logged_in"));
                
                if (document.cookie.includes("is_logged_in")) { // Check flag cookie
                    const authStatus = await checkAuth();
                    console.log("Auth Check:", authStatus);
                    setIsAuthenticated(authStatus.isAuthenticated);
                } else {
                    console.log("No is_logged_in cookie, skipping checkAuth");
                    setIsAuthenticated(false);
                }
            } 
            catch (error) 
            {
                console.error("Error checking auth status:", error);
                setIsAuthenticated(false);
            } 
            finally 
            {
                setIsLoading(false); 
            }
        };

        checkAuthStatus();
    }, []);
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? <Navigate to="/main" replace /> : <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/main" replace />
                        ) : (
                            <CodeIDE_Login mode="login" setIsAuthenticated={setIsAuthenticated} />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/main" replace />
                        ) : (
                            <CodeIDE_Login mode="signup" setIsAuthenticated={setIsAuthenticated} />
                        )
                    }
                />
                <Route
                    path="/main"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <CodeIDE_Main />
                        </ProtectedRoute>
                    }
                />
                <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/main" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

export default App;