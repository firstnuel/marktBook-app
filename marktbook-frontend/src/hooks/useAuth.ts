import { useAppDispatch, useAppSelector } from '../store'
import { login, clearError, register, passwordReset, passwordUpdate } from '@reducers/authReducer'
import { LoginData, RegisterData, passwordData } from '@typess/auth'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, error, reset, loading, registered, updated, userToken } = useAppSelector(state => state.auth)

  if (error) {
    setTimeout(() => {
      dispatch(clearError())
    }, 5000)
  }

  return {
    user,
    error,
    loading,
    userToken,
    reset,
    updated,
    registered,
    passwordReset: (email: string) => dispatch((passwordReset(email))),
    passwordUpdate: (data: { passwordData: passwordData, token: string}) => dispatch(passwordUpdate(data)),
    isAuthenticated: !!user,
    login: (userData: LoginData) => dispatch(login(userData)),
    register: (registerData: RegisterData) => dispatch(register(registerData)),
    clearError:  () => dispatch(clearError()),
  }
}


