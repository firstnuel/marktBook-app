import {
  fetchSales,
  clearError,
  setMainOpt,
  setSubOpt,
  processSale,
  rmSale,
} from '@reducers/transReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useCallback } from 'react'
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


  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])

  const rmSaleHandler = useCallback(() => dispatch(rmSale()), [dispatch])

  const fetchSalesHandler = useCallback(() => dispatch(fetchSales()), [dispatch])

  const setMainOption = useCallback((option: string) => dispatch(setMainOpt({ option })), [dispatch])

  const setSubOption = useCallback((option: string) => dispatch(setSubOpt({ option })), [dispatch])

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
    clearError: clearErrorHandler,
    setMainOpt: setMainOption,
    setSubOpt: setSubOption,
    fetchSales: fetchSalesHandler,
    processSale: processSaleHandler,
  }
}