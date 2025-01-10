import { useAppDispatch, useAppSelector } from '../store'
import { login, clearError, register } from '../reducers/authReducer'
import { LoginData, RegisterData } from '../types/auth'


export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, error, loading, registered } = useAppSelector(state => state.auth)

  if (error) {
    setTimeout(() => {
      dispatch(clearError())
    }, 3000)
  }

  return {
    user,
    error,
    loading,
    registered,
    isAuthenticated: !!user,
    login: (userData: LoginData) => dispatch(login(userData)),
    register: (registerData: RegisterData) => dispatch(register(registerData)),
    clearError:  () => dispatch(clearError())
  }
}


