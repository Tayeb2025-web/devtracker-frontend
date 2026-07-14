import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { TimerProvider } from './contexts/TimerContext'
import { MusicProvider } from './contexts/MusicContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ThemeProvider>
          <TimerProvider>
            <MusicProvider>
              <App />
            </MusicProvider>
          </TimerProvider>
        </ThemeProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
