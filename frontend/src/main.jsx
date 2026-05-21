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
            background: 'rgba(253,248,240,0.97)',
            color: '#2c1f0e',
            border: '1px solid rgba(201,151,58,0.35)',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.85rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(44,31,14,0.12)',
          },
          success: {
            iconTheme: { primary: '#c9973a', secondary: '#fdf8f0' },
          },
          error: {
            iconTheme: { primary: '#c9605a', secondary: '#fdf8f0' },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
)
