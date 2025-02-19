import { useEffect, useCallback } from 'react'
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
  resetCat,
  updateStock,
  fetchProductsByCat,
} from '@reducers/invReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { EditStockData, IProduct, IStockData } from '@typess/inv'

export const useInv = () => {
  const dispatch = useAppDispatch()
  const {
    mainOpt,
    subOpt,
    product,
    stock,
    error,
    loading,
    success,
    successMsg,
    productsByCat
  } = useAppSelector(state => state.inv)

  // Automatically clear error after 7 seconds if an error or success message exists
  useEffect(() => {
    if (error || successMsg) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [error, dispatch, successMsg])

  // Memoize functions to avoid unnecessary re-creations on re-renders
  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])
  const removeProductStock = useCallback(() => dispatch(rmPrdStck()), [dispatch])

  const updateStockHandler = useCallback(
    (productId: string, data: EditStockData) => dispatch(updateStock({ productId, data })),
    [dispatch]
  )

  const deleteProductHandler = useCallback(
    (productId: string) => dispatch(deleteProduct(productId)),
    [dispatch]
  )

  const fetchProductHandler = useCallback(
    (productId: string) => dispatch(fetchProduct(productId)),
    [dispatch]
  )

  const fetchStockHandler = useCallback(
    (productId: string) => dispatch(fetchStock(productId)),
    [dispatch]
  )

  const createProductHandler = useCallback(
    (data: IProduct) => dispatch(createProduct({ data })),
    [dispatch]
  )

  const fetchProductsByCategory = useCallback(
    (category: string) => dispatch(fetchProductsByCat(category)),
    [dispatch]
  )

  const addStockHandler = useCallback(
    (data: IStockData) => dispatch(addStock({ data })),
    [dispatch]
  )

  const updateProductHandler = useCallback(
    (productId: string, data: IProduct) => dispatch(updateProduct({ productId, data })),
    [dispatch]
  )

  const setMainOption = useCallback(
    (option: string) => dispatch(setMainOpt({ option })),
    [dispatch]
  )

  const setSubOption = useCallback(
    (option: string) => dispatch(setSubOpt({ option })),
    [dispatch]
  )

  const resetOptions = useCallback(() => dispatch(resetOpt()), [dispatch])

  const resetCatOption = useCallback(() => dispatch(resetCat()), [dispatch])

  return {
    mainOpt,
    subOpt,
    product,
    stock,
    success,
    error,
    loading,
    successMsg,
    productsByCat,
    resetCat: resetCatOption,
    clearError: clearErrorHandler,
    rmPrdStck: removeProductStock,
    updateStock: updateStockHandler,
    deleteProduct: deleteProductHandler,
    fetchProduct: fetchProductHandler,
    fetchStock: fetchStockHandler,
    createProduct: createProductHandler,
    fetchProductsByCat: fetchProductsByCategory,
    addStock: addStockHandler,
    updateProduct: updateProductHandler,
    setMainOpt: setMainOption,
    setSubOpt: setSubOption,
    resetOpt: resetOptions
  }
}
