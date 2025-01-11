import { Routes, Route } from 'react-router'
import LoginForm from '@auth/AuthForms/LoginForm'
import RegisterForm from '@auth/AuthForms/RegisterForm'
import PasswordResetForm from '@auth/AuthForms/PasswordReset'
import PasswordUpdateForm from '@auth/AuthForms/PasswordUpdate'


const AppRoutes = () => {
  return(
    <Routes>
      <Route path='login' element={<LoginForm />}></Route>
      <Route path='register' element={<RegisterForm />}></Route>
      <Route path='forgot-password' element={<PasswordResetForm />}></Route>
      <Route path="/reset-password" element={<PasswordUpdateForm />} />
    </Routes>
  )
}


export default AppRoutes