import {
  clearError,
  fetchBusiness,
  update,
  setMainOpt,
  fetchBusinessUsers,
  setSubOpt,
} from '@reducers/businessReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useCallback } from 'react'
import { Business } from '@typess/bizness'

export const useBusiness = () => {
  const { business, error, loading, success, mainOpt, users } = useAppSelector(state => state.business)
  const dispatch = useAppDispatch()


  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [error, dispatch, success])

  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])

  const setMainOption = useCallback((option: string) => dispatch(setMainOpt({ option })), [dispatch])

  const setSubOption = useCallback((option: string) => dispatch(setSubOpt({ option })), [dispatch])

  const fetchBusinessHandler = useCallback((businessId: string) => dispatch(fetchBusiness(businessId)), [dispatch])

  const fetchUsersHandler = useCallback(() => dispatch(fetchBusinessUsers()), [dispatch])

  const updateHandler = useCallback((businessId: string, data: Partial<Business>) =>
    dispatch(update({ businessId, data })), [dispatch])

  return{
    mainOpt,
    business,
    loading,
    success,
    error,
    users,
    clearError: clearErrorHandler,
    fetchBusiness: fetchBusinessHandler,
    update: updateHandler,
    setMainOpt: setMainOption,
    setSubOpt: setSubOption,
    fetchBusinessUsers: fetchUsersHandler
  }
}