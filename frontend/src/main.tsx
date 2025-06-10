import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { VendedorProvider } from './utils/Context/VendedorSelectedContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
    <VendedorProvider>
        <App />
      </VendedorProvider>
    </Router>
  </React.StrictMode>,
)

//
