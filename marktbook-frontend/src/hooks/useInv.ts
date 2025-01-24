import {
  fetchProduct,
  clearError,
  setMainOpt,
  setSubOpt,
  resetOpt,
  updateProduct,
  createProduct,
  addStock,
  deleteProduct,
  fetchStock,
  rmPrdStck,
  updateStock,
} from '@reducers/invReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { EditStockData, IProduct, IStockData } from '@typess/inv'
import { useEffect } from 'react'

export const useInv = () => {
  const dispatch = useAppDispatch()
  const {
    mainOpt,
    subOpt,
    product,
    stock,
    error,
    loading,
    success
  } = useAppSelector(state => state.inv)

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [error, success, dispatch])


  return {
    mainOpt,
    subOpt,
    product,
    stock,
    success,
    error,
    loading,
    clearError: () => dispatch(clearError()),
    rmPrdStck: () => dispatch(rmPrdStck()),
    updateStock: (productId: string, data: EditStockData ) => dispatch(updateStock({ productId, data })),
    deleteProduct: (productId: string) => dispatch(deleteProduct(productId)),
    fetchProduct: (productId: string) => dispatch(fetchProduct(productId)),
    fetchStock: (productId: string) => dispatch(fetchStock(productId)),
    createProduct: (data: IProduct) => dispatch(createProduct({ data })),
    addStock: (data: IStockData) => dispatch(addStock({ data })),
    updateProduct: (productId: string, data: IProduct ) => dispatch(updateProduct({ productId, data })),
    setMainOpt: (option: string) => dispatch(setMainOpt({ option })),
    setSubOpt: (option: string) => dispatch(setSubOpt({ option })),
    resetOpt: () => dispatch(resetOpt())
  }
}