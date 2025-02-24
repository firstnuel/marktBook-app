import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useCallback } from 'react'
import { Location, StockMovement } from '@typess/stocks'
import {
  clearError,
  fetchStocks,
  setMainOpt,
  setSubOpt,
  fetchStockBySupplier,
  createLocation,
  resetSupplier,
  fetchLocations,
  rmLocation,
  deleteLocation,
  createMovement,
  editLocation,
  stLocation,
  fetchLowStock } from '@reducers/stocksReducer'

export const useStocks = () => {
  const { stocks,
    lowStocks,
    error,
    loading,
    success,
    locations,
    movements,
    bySupplier,
    setLocation,
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

  const resetSupplierHandler = useCallback(() => dispatch(resetSupplier()), [dispatch])

  const fetchStocksHandler = useCallback(() => dispatch(fetchStocks()), [dispatch])

  const fetchLowStockHandler = useCallback(() => dispatch(fetchLowStock()), [dispatch])

  const fetchLocationsHandler = useCallback(() => dispatch(fetchLocations()), [dispatch])

  const deleteLocationHandler = useCallback((id: string) => dispatch(deleteLocation(id)), [dispatch])

  const editLocationHandler = useCallback((id: string, data: Partial<Location>) =>
    dispatch(editLocation({ id, data })), [dispatch])

  const fetchBySupplierHandler = useCallback((supplierId: string) => dispatch(fetchStockBySupplier(supplierId)), [dispatch])

  const createLocationHandler = useCallback((data: Partial<Location>) => dispatch(createLocation(data)), [dispatch])

  const createMovementHandler = useCallback((data: Partial<StockMovement>) => dispatch(createMovement(data)), [dispatch])

  const setMainOption = useCallback((option: string) => dispatch(setMainOpt({ option })), [dispatch])

  const setSubOption = useCallback((option: string) => dispatch(setSubOpt({ option })), [dispatch])

  const setLocationHandler = useCallback((location: Location) => dispatch(stLocation({ location })), [dispatch])

  const rmLocationHandler = useCallback(() => dispatch(rmLocation()), [dispatch])

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
    bySupplier,
    setLocation,
    resetSupplier: resetSupplierHandler,
    clearError: clearErrorHandler,
    fetchStocks: fetchStocksHandler,
    fetchLowStock: fetchLowStockHandler,
    setMainOpt: setMainOption,
    fetchStockBySupplier: fetchBySupplierHandler,
    createLocation: createLocationHandler,
    setSubOpt: setSubOption,
    rmLocation: rmLocationHandler,
    fetchLocations: fetchLocationsHandler,
    stLocation: setLocationHandler,
    deleteLocation: deleteLocationHandler,
    editLocation: editLocationHandler,
    createMovement: createMovementHandler,
  }
}
