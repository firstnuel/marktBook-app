import { useAppDispatch, useAppSelector } from '../store'
import { login, clearError, register, passwordReset, passwordUpdate } from '../reducers/authReducer'
import { LoginData, RegisterData, passwordData } from '../types/auth'


export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, error, reset, loading, registered, updated } = useAppSelector(state => state.auth)

  if (error) {
    setTimeout(() => {
      dispatch(clearError())
    }, 5000)
  }

  return {
    user,
    error,
    loading,
    reset,
    updated,
    registered,
    passwordReset: (email: string) => dispatch((passwordReset(email))),
    passwordUpdate: (data: { passwordData: passwordData, token: string}) => dispatch(passwordUpdate(data)),
    isAuthenticated: !!user,
    login: (userData: LoginData) => dispatch(login(userData)),
    register: (registerData: RegisterData) => dispatch(register(registerData)),
    clearError:  () => dispatch(clearError())
  }
}


