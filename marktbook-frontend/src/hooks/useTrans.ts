import {
  fetchSales,
  clearError,
  setMainOpt,
  setSubOpt,
  setSale,
  processSale,
  rmSale,
  setInvoice,
  fetchSale,
  updateSale,
  cancelSale
} from '@reducers/transReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useCallback, useEffect } from 'react'
import { Sale } from '@typess/trans'


export const useTrans = () => {

  const {
    mainOpt,
    subOpt,
    success,
    invoice,
    error,
    loading,
    sales,
    sale,
    salesReturns,
    invoices,
    purchaseReturn,
    purchases,
    saleReturn
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

  const fetchSaleHandler = useCallback((id: string) => dispatch(fetchSale(id)), [dispatch])

  const setMainOption = useCallback((option: string) => dispatch(setMainOpt({ option })), [dispatch])

  const setSubOption = useCallback((option: string) => dispatch(setSubOpt({ option })), [dispatch])

  const setSaleHandler = useCallback((sale: Sale) => dispatch(setSale({ sale })), [dispatch])

  const setInvoiceHandler = useCallback((invoice: Sale) => dispatch(setInvoice({ invoice })), [dispatch])

  const processSaleHandler = useCallback((data: Partial<Sale>) => dispatch(processSale(data)), [dispatch])

  const updateSaleHandler = useCallback(
    (saleId: string, data: { status: string; businessId: string }) =>
      dispatch(updateSale({ saleId, data })),
    [dispatch]
  )

  const cancelSaleHandler = useCallback(
    (saleId: string, data: { reason: string; businessId: string }) =>
      dispatch(cancelSale({ saleId, data })),
    [dispatch]
  )

  return {
    mainOpt,
    loading,
    subOpt,
    success,
    error,
    sales,
    salesReturns,
    saleReturn,
    invoices,
    purchaseReturn,
    purchases,
    sale,
    invoice,
    rmSale: rmSaleHandler,
    setInvoice: setInvoiceHandler,
    setSale: setSaleHandler,
    clearError: clearErrorHandler,
    setMainOpt: setMainOption,
    setSubOpt: setSubOption,
    fetchSales: fetchSalesHandler,
    fetchSale: fetchSaleHandler,
    processSale: processSaleHandler,
    updateSale: updateSaleHandler,
    cancelSale: cancelSaleHandler,
  }
}