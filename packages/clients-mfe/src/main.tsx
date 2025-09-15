import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ClientsApp from './ClientsApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientsApp />
  </StrictMode>,
)
