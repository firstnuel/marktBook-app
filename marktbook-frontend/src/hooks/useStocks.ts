import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useCallback } from 'react'
import {
  clearError,
  fetchStocks,
  setMainOpt,
  setSubOpt,
  fetchLocations,
  fetchLowStock } from '@reducers/stocksReducer'

export const useStocks = () => {
  const { stocks,
    lowStocks,
    error,
    loading,
    success,
    locations,
    movements,
    mainOpt,
    subOpt } = useAppSelector(state => state.stocks)
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

  const fetchStocksHandler = useCallback(() => dispatch(fetchStocks()), [dispatch])

  const fetchLowStockHandler = useCallback(() => dispatch(fetchLowStock()), [dispatch])

  const fetchLocationsHandler = useCallback(() => dispatch(fetchLocations()), [dispatch])

  const setMainOption = useCallback((option: string) => dispatch(setMainOpt({ option })), [dispatch])

  const setSubOption = useCallback((option: string) => dispatch(setSubOpt({ option })), [dispatch])

  return {
    mainOpt,
    subOpt,
    stocks,
    lowStocks,
    error,
    loading,
    locations,
    success,
    movements,
    clearError: clearErrorHandler,
    fetchStocks: fetchStocksHandler,
    fetchLowStock: fetchLowStockHandler,
    setMainOpt: setMainOption,
    setSubOpt: setSubOption,
    fetchLocations: fetchLocationsHandler,
  }
}
