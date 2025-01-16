import { CartItemProps } from '@typess/pos'
import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  clearCart,
  clearError,
  addToCart,
  fetchProducts,
  addQuantity,
  subQuantity,
  updatePrice,
} from '@reducers/posReducers'

export const usePos = () => {
  const dispatch = useAppDispatch()
  const {
    products,
    cartItems,
    searchPhrase,
    searchKey,
    loading,
    error,
    priceInfo
  } = useAppSelector(state => state.pos)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const memoizedFetchProducts = useCallback(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return {
    products,
    cartItems,
    searchPhrase,
    searchKey,
    loading,
    error,
    priceInfo,
    updateDiscount: ( discount: number) => dispatch(updatePrice({ discount })),
    clearCart: () => dispatch(clearCart()),
    addToCart: (cartItem: CartItemProps) => dispatch(addToCart({ cartItem })),
    fetchProducts: memoizedFetchProducts,
    addQuantity: (productId: string) => dispatch(addQuantity({ productId })),
    subQuantity: (productId: string) => dispatch(subQuantity({ productId })),
  }
}
