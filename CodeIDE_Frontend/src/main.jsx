import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import CodeIDE_Login from './pages/CodeIDE_Login'
import CodeIDE_Main from './CodeIDE_Main'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App/> */}
    {/* <CodeIDE_Login /> */}
    <CodeIDE_Main/>
  </StrictMode>,
)
