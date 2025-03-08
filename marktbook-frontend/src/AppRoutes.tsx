import { Routes, Route, Navigate } from 'react-router-dom'
import Inventory from '@features/inventory/Inventory'
import LoginForm from '@auth/AuthForms/LoginForm'
import RegisterForm from '@auth/AuthForms/RegisterForm'
import PasswordResetForm from '@auth/AuthForms/PasswordReset'
import PasswordUpdateForm from '@auth/AuthForms/PasswordUpdate'
import PointOfSale from '@features/pos/PointOfSale'
import StocksMangement from '@features/stocks/StocksMangement'
import Home from '@features/home/home'
import { useAuth } from '@hooks/useAuth'
import { useFetchData } from '@hooks/useFetchData'
import Settings from '@features/business/BusinessSettings'
import { memo, ReactNode } from 'react'
import Contacts from '@features/contacts/Contacts'
import Transactions from '@features/transactions/Transactions'
import Dashboard from '@features/dashboard/Dashboard'


// Memoize ProtectedRoute to prevent unnecessary re-renders
const ProtectedRoute = memo(({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
})

ProtectedRoute.displayName = 'ProtectedRoute'

const AppRoutes = () => {
  useFetchData()

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<PasswordResetForm />} />
      <Route path="/reset-password" element={<PasswordUpdateForm />} />

      {/* Protected Routes */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
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
        path="/contacts"
        element={
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stocks"
        element={
          <ProtectedRoute>
            <StocksMangement />
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