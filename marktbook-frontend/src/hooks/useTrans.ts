import {
  fetchSales,
  clearError,
  setMainOpt,
  setSubOpt,
  setSale,
  processSale,
  rmSale,
} from '@reducers/transReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useCallback, useEffect } from 'react'
import { Sale } from '@typess/trans'


export const useTrans = () => {

  const {
    mainOpt,
    subOpt,
    success,
    error,
    loading,
    sales,
    sale,
    salesReturn,
    invoices,
    purchaseReturn,
    purchases
  } = useAppSelector(state => state.trans)
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

  const rmSaleHandler = useCallback(() => dispatch(rmSale()), [dispatch])

  const fetchSalesHandler = useCallback(() => dispatch(fetchSales()), [dispatch])

  const setMainOption = useCallback((option: string) => dispatch(setMainOpt({ option })), [dispatch])

  const setSubOption = useCallback((option: string) => dispatch(setSubOpt({ option })), [dispatch])

  const setSaleHandler = useCallback((sale: Sale) => dispatch(setSale({ sale })), [dispatch])

  const processSaleHandler = useCallback((data: Partial<Sale>) => dispatch(processSale(data)), [dispatch])

  return {
    mainOpt,
    loading,
    subOpt,
    success,
    error,
    sales,
    salesReturn,
    invoices,
    purchaseReturn,
    purchases,
    sale,
    rmSale: rmSaleHandler,
    setSale: setSaleHandler,
    clearError: clearErrorHandler,
    setMainOpt: setMainOption,
    setSubOpt: setSubOption,
    fetchSales: fetchSalesHandler,
    processSale: processSaleHandler,
  }
}