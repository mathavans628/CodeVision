import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CodeIDE_Login from './CodeIDE_Login.jsx'
import CodeIDE_MainPage from './Theme.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <CodeIDE_Login /> */}
    <CodeIDE_MainPage/>
  </StrictMode>,
)
