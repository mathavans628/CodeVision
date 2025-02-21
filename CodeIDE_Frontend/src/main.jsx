import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
<<<<<<< HEAD
// import App from './App.jsx'
import CodeIDE_Main from './CodeIDE_Main.jsx'
import CodeIDE_Login from './pages/CodeIDE_Login.jsx'
// import LoginFetch from './Fetch/LoginFetch.js'
=======

import CodeIDE_Login from './pages/CodeIDE_Login'
import CodeIDE_Main from './CodeIDE_Main'
>>>>>>> 12ca69beb5f4ae0e81d2d683255480125c58f697

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App/> */}
    {/* <CodeIDE_Login /> */}
    <CodeIDE_Main/>
  </StrictMode>,
)
