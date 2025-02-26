import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import CodeIDE_Main from './CodeIDE_Main.jsx'
// import CodeIDE_Login from './pages/CodeIDE_Login.jsx'
// import LoginFetch from './Fetch/LoginFetch.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
    {/* <CodeIDE_Login /> */}
    {/* <CodeIDE_Main/> */}
  </StrictMode>,
)