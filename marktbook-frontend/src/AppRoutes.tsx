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
import Settings from '@features/business/BusinessSettings'
import { useBusiness } from '@hooks/useBusiness'
import { usePos } from '@hooks/usePos'
import { useEffect, memo } from 'react'
import Contacts from '@features/contacts/Contacts'
import { useContacts } from '@hooks/useContacts'


export let TaxRate: number

// Memoize ProtectedRoute to prevent unnecessary re-renders
const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
})

ProtectedRoute.displayName = 'ProtectedRoute'

const AppRoutes = () => {
  const { user, fetchUser, userToken } = useAuth()
  const { business, fetchBusiness, fetchBusinessUsers, users } = useBusiness()
  const { fetchProducts, products } = usePos()
  const { fetchCustomers, fetchSuppliers, customers, suppliers } = useContacts()

  useEffect(() => {
    if (userToken && !user) {
      fetchUser()
    }
  }, [userToken, user, fetchUser])

  useEffect(() => {
    if (user?.associatedBusinessesId && !business) {
      fetchBusiness(user.associatedBusinessesId)
    }
  }, [user?.associatedBusinessesId, business, fetchBusiness])

  useEffect(() => {
    if (business?._id && !products.length) {
      fetchProducts()
    }
  }, [business?._id, products.length, fetchProducts])

  useEffect(() => {
    if (business?._id && !users.length) {
      fetchBusinessUsers()
    }
  }, [business?._id, fetchBusinessUsers, users.length])

  useEffect(() => {
    if (business?._id && !customers.length) {
      fetchCustomers()
    }
  }, [business?._id, fetchCustomers, customers.length])

  useEffect(() => {
    if (business?._id && !suppliers.length) {
      fetchSuppliers()
    }
  }, [business?._id, fetchSuppliers, suppliers.length])

  useEffect(() => {
    if (business?.taxRate) {
      TaxRate = business.taxRate
    }
  }, [business?.taxRate])

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