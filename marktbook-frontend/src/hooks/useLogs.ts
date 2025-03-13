import { clearError, setMainOpt, fetchLogs } from '@reducers/logsReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useCallback } from 'react'

export const useLogs = () => {
  const {
    mainOpt,
    inventory,
    stock,
    users,
    success,
    business,
    error,
    loading,
    contacts,
    transaction
  } = useAppSelector(state => state.logs)
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

  const fetchLogsHandler = useCallback(() => dispatch(fetchLogs()), [dispatch])

  const setMainOption = useCallback((option: string) => dispatch(setMainOpt({ option })), [dispatch])


  return {
    mainOpt,
    inventory,
    stock,
    users,
    business,
    loading,
    contacts,
    transaction,
    error,
    success,
    clearError: clearErrorHandler,
    setMainOpt: setMainOption,
    fetchLogs: fetchLogsHandler
  }
}