import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import CodeIDE_Login from './CodeIDE_Login.jsx'
<<<<<<< HEAD
import CodeIDE_MainPage from './CodeIDE_Main.jsx'
=======
import CodeIDE_MainPage from './Theme.jsx'
=======
import CodeIDE_Login from './pages/CodeIDE_Login.jsx'
import LoginFetch from './Fetch/LoginFetch.js'
>>>>>>> cee6ff4 (Login-Version-1-Mathavan)
>>>>>>> 42125ad26c14a7e04ea1648d5a6694c2b9cbce68

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <CodeIDE_Login /> */}
    <CodeIDE_MainPage/>
  </StrictMode>,
)
