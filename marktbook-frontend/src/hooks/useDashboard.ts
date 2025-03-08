import { QueryPeriod } from '@typess/dashboard'
import { fetchSummary, clearError, setPeriod } from '@reducers/dashReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useCallback, useEffect } from 'react'


export const useDashboard = () => {

  const { data, period, success, error, loading } = useAppSelector(state => state.dash)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error || success === 'Sales data fetched successfully' ) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch, success ])

  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])

  const fetchSummaryHandler = useCallback((businessId: string, period: QueryPeriod) =>
    dispatch(fetchSummary({ businessId, period })), [dispatch])

  const setPeriodHandler = useCallback((period: QueryPeriod) => dispatch(setPeriod({ period })), [dispatch])

  return {
    loading,
    success,
    error,
    period,
    data,
    clearError: clearErrorHandler,
    setPeriod: setPeriodHandler,
    fetchSummary: fetchSummaryHandler
  }
}