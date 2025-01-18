import { Routes, Route, Navigate } from 'react-router'
import Inventory from '@features/inventory/Inventory'
import LoginForm from '@auth/AuthForms/LoginForm'
import RegisterForm from '@auth/AuthForms/RegisterForm'
import PasswordResetForm from '@auth/AuthForms/PasswordReset'
import PasswordUpdateForm from '@auth/AuthForms/PasswordUpdate'
import PointOfSale from '@features/pos/PointOfSale'
import Home from '@features/home/home'
// import { useAuth } from '@hooks/useAuth'

const AppRoutes = () => {
  // const { userT } = useAuth()

  // const ProtectedRoute = ({ children }) => {
  //   if (!user) {
  //     return <Navigate to="/login" replace />
  //   }
  //   return children
  // }


  return(
    <Routes>

      <Route path='/login' element={<LoginForm />} />
      <Route path='/register' element={<RegisterForm />} />
      <Route path='forgot-password' element={<PasswordResetForm />} />
      <Route path="/reset-password" element={<PasswordUpdateForm />} />


      <Route path='/inventory' element={<Inventory />} />
      <Route path="/pos" element={<PointOfSale />} />
      <Route path="/" element={<Home />} />





    </Routes>
  )
}


export default AppRoutes