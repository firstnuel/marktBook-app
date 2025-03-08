import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  login,
  clearError,
  register,
  passwordReset,
  passwordUpdate,
  fetchUser,
  logout
} from '@reducers/authReducer'
import { LoginData, RegisterData, passwordData } from '@typess/auth'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, error, reset, loading, registered, updated, userToken } = useAppSelector(state => state.auth)

  // Automatically clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  // handlers
  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])

  const passwordResetHandler = useCallback(
    (email: string) => dispatch(passwordReset(email)),
    [dispatch]
  )

  const passwordUpdateHandler = useCallback(
    (data: { passwordData: passwordData, token: string }) => dispatch(passwordUpdate(data)),
    [dispatch]
  )

  const loginHandler = useCallback(
    (userData: LoginData) => dispatch(login(userData)),
    [dispatch]
  )

  const logoutHandler = useCallback(() => dispatch(logout()), [dispatch])
  const fetchUserHandler = useCallback(() => dispatch(fetchUser()), [dispatch])

  const registerHandler = useCallback(
    (registerData: RegisterData) => dispatch(register(registerData)),
    [dispatch]
  )

  return {
    user,
    error,
    loading,
    userToken,
    reset,
    updated,
    registered,
    fetchUser: fetchUserHandler,
    passwordReset: passwordResetHandler,
    passwordUpdate: passwordUpdateHandler,
    isAuthenticated: !!user,
    login: loginHandler,
    logout: logoutHandler,
    register: registerHandler,
    clearError: clearErrorHandler
  }
}
