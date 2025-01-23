import { useAppDispatch, useAppSelector } from '../store'
import { login, clearError, register, passwordReset, passwordUpdate, fetchUser, logout } from '@reducers/authReducer'
import { LoginData, RegisterData, passwordData,  } from '@typess/auth'
import { useEffect } from 'react'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, error, reset, loading, registered, updated, userToken } = useAppSelector(state => state.auth)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])


  useEffect(() => {
    if(!user) {
      dispatch(fetchUser())
    }
  }, [dispatch, user])

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
    logout: () => dispatch(logout()),
    register: (registerData: RegisterData) => dispatch(register(registerData)),
    clearError:  () => dispatch(clearError()),
  }
}


