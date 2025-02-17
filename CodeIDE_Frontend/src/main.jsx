import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import CodeIDE_Login from './CodeIDE_Login.jsx'
import CodeIDE_MainPage from './Theme.jsx'
=======
import CodeIDE_Login from './pages/CodeIDE_Login.jsx'
import LoginFetch from './Fetch/LoginFetch.js'
>>>>>>> cee6ff4 (Login-Version-1-Mathavan)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <CodeIDE_Login /> */}
    <CodeIDE_MainPage/>
  </StrictMode>,
)
