import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  clearCart,
  clearError,
  addToCart,
  fetchProducts,
  addQuantity,
  subQuantity,
  updatePrice,
  searchByCategory,
  searchByKeyandPhrase,
} from '@reducers/posReducers'
import { CartItemProps, ProductCategory, SearchKeys } from '@typess/pos'



export const usePos = () => {
  const dispatch = useAppDispatch()

  const {
    products,
    cartItems,
    searchPhrase,
    filteredProducts,
    searchKey,
    loading,
    error,
    category,
    priceInfo,
    successMsg,
  } = useAppSelector(state => state.pos)

  // Automatically clear error or success message after 5 seconds
  useEffect(() => {
    if (error || successMsg) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch, successMsg])


  // Memoized functions to avoid unnecessary re-creations
  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])

  const fetchProductsHandler = useCallback(() => dispatch(fetchProducts()), [dispatch])

  const searchByCategoryHandler = useCallback(
    (category: ProductCategory | 'ALL') => dispatch(searchByCategory({ category })),
    [dispatch]
  )

  const searchByKeyAndPhraseHandler = useCallback(
    (searchKey: keyof typeof SearchKeys, searchPhrase: string) =>
      dispatch(searchByKeyandPhrase({ searchKey, searchPhrase })),
    [dispatch]
  )

  const updateDiscountHandler = useCallback(
    (discount: number) => dispatch(updatePrice({ discount })),
    [dispatch]
  )

  const clearCartHandler = useCallback(() => dispatch(clearCart()), [dispatch])

  const addToCartHandler = useCallback(
    (cartItem: CartItemProps) => dispatch(addToCart({ cartItem })),
    [dispatch]
  )

  const addQuantityHandler = useCallback(
    (productId: string) => dispatch(addQuantity({ productId })),
    [dispatch]
  )

  const subQuantityHandler = useCallback(
    (productId: string) => dispatch(subQuantity({ productId })),
    [dispatch]
  )

  return {
    products,
    cartItems,
    searchPhrase,
    searchKey,
    loading,
    filteredProducts,
    category,
    error,
    priceInfo,
    successMsg,
    clearError: clearErrorHandler,
    fetchProducts: fetchProductsHandler,
    searchByCategory: searchByCategoryHandler,
    searchByKeyandPhrase: searchByKeyAndPhraseHandler,
    updateDiscount: updateDiscountHandler,
    clearCart: clearCartHandler,
    addToCart: addToCartHandler,
    addQuantity: addQuantityHandler,
    subQuantity: subQuantityHandler,
  }
}
