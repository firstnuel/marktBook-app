import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import store from './store.ts'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>

  </StrictMode>,
)
