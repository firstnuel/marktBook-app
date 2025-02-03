import { clearError, fetchBusiness, updateCategory } from '@reducers/businessReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useAuth } from '@hooks/useAuth'
import { useEffect } from 'react'

export const useBusiness = () => {
  const { business, error, loading, success } = useAppSelector(state => state.business)
  const dispatch = useAppDispatch()
  const { user } = useAuth()

  useEffect(() => {
    if(user !== null)
      dispatch(fetchBusiness(user.associatedBusinessesId))
  }, [user, dispatch])

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [error, dispatch, success])

  return{
    business,
    loading,
    success,
    error,
    clearError: () => dispatch(clearError()),
    fetchBusiness: (businessId: string) => dispatch(fetchBusiness(businessId)),
    updateCategory: (businessId: string, data: { customCategories: string[] }) => dispatch(updateCategory({ businessId, data }))
  }
}