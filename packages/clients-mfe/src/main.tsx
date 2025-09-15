import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ClientsApp from './ClientsApp.tsx'
import { ClientsProvider } from './contexts/ClientsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientsProvider>
      <ClientsApp />
    </ClientsProvider>
  </StrictMode>,
)
