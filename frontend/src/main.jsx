import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1510',
            color: '#f0d080',
            border: '1px solid rgba(201,168,76,0.3)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.85rem',
          },
          success: {
            iconTheme: { primary: '#c9a84c', secondary: '#1a1510' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1a1510' },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
)
