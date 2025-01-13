import { Routes, Route } from 'react-router'
import LoginForm from '@auth/AuthForms/LoginForm'
import RegisterForm from '@auth/AuthForms/RegisterForm'
import PasswordResetForm from '@auth/AuthForms/PasswordReset'
import PasswordUpdateForm from '@auth/AuthForms/PasswordUpdate'
import PointOfSale from '@features/pos/PointOfSale'


const AppRoutes = () => {
  return(
    <Routes>

      <Route path='login' element={<LoginForm />} />
      <Route path='register' element={<RegisterForm />} />
      <Route path='forgot-password' element={<PasswordResetForm />} />
      <Route path="/reset-password" element={<PasswordUpdateForm />} />
      <Route path="/pos" element={<PointOfSale />} />

    </Routes>
  )
}


export default AppRoutes