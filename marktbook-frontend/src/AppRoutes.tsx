import { Routes, Route, Navigate } from 'react-router-dom'
import Inventory from '@features/inventory/Inventory'
import LoginForm from '@auth/AuthForms/LoginForm'
import RegisterForm from '@auth/AuthForms/RegisterForm'
import PasswordResetForm from '@auth/AuthForms/PasswordReset'
import PasswordUpdateForm from '@auth/AuthForms/PasswordUpdate'
import PointOfSale from '@features/pos/PointOfSale'
import Home from '@features/home/home'
import { useAuth } from '@hooks/useAuth'

const AppRoutes = () => {
  const { user } = useAuth()

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<PasswordResetForm />} />
      <Route path="/reset-password" element={<PasswordUpdateForm />} />

      {/* Protected Routes */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <PointOfSale />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes