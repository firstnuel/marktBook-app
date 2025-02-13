import { clearError, fetchBusiness, update } from '@reducers/businessReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useAuth } from '@hooks/useAuth'
import { useEffect, useRef, useCallback } from 'react'
import { Business } from '@typess/bizness'

export const useBusiness = () => {
  const { business, error, loading, success } = useAppSelector(state => state.business)
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const hasFetchedBusiness = useRef(false)

  useEffect(() => {
    if(user && !hasFetchedBusiness.current) {
      dispatch(fetchBusiness(user.associatedBusinessesId))
      hasFetchedBusiness.current = true
    }
  }, [user, dispatch])

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [error, dispatch, success])

  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])
  const fetchBusinessHandler = useCallback((businessId: string) => dispatch(fetchBusiness(businessId)), [dispatch])
  const updateHandler = useCallback((businessId: string, data: Partial<Business>) =>
    dispatch(update({ businessId, data })), [dispatch])

  return{
    business,
    loading,
    success,
    error,
    clearError: clearErrorHandler,
    fetchBusiness: fetchBusinessHandler,
    update: updateHandler
  }
}