import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CodeIDE_Login from './CodeIDE_Login.jsx'
import MainPage from './CodeIDEMainPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <CodeIDE_Login /> */}
    <MainPage/>
  </StrictMode>,
)
