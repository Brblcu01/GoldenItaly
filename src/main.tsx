import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { initAnalyticsAdapter } from './analytics'
import './styles.css'

const pathname = window.location.pathname
if (window.location.search.includes('__refresh=')) window.history.replaceState(null, '', '/')
const app = (
  <React.StrictMode>
    <App pathname={pathname} />
  </React.StrictMode>
)

const root = document.getElementById('root')!

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

initAnalyticsAdapter()
