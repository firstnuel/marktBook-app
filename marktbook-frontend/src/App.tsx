import { useEffect } from 'react'
import AppRoutes from './AppRoutes'
import './App.scss'

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('Service Worker registered successfully!'))
        .catch((error) => console.log('Service Worker registration failed:', error))
    }
  }, [])

  return (
    <div>
      <AppRoutes />
    </div>
  )
}

export default App
