import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AppRouter } from './router/index'
import { useAuthStore } from './store/authStore'
import './index.css'

// Initialize auth state from local storage on app load
useAuthStore.getState().initialize()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1e1e2c',
          color:      '#ffffff',
          border:     '1px solid #2a2a3a',
          borderRadius: '12px',
          fontSize:   '13px',
          boxShadow:  '0 8px 32px rgba(0,0,0,0.4)',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#1e1e2c' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#1e1e2c' },
        },
        loading: {
          iconTheme: { primary: '#6366f1', secondary: '#1e1e2c' },
        },
      }}
    />
  </React.StrictMode>
)
