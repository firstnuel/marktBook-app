import { CartItemProps, ProductCategory, SearchKeys } from '@typess/pos'
import {  useEffect } from 'react'
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
    if (!products.length) {
      dispatch(fetchProducts())
    }
  }, [dispatch, products.length])

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
    searchByCategory: (category: ProductCategory | 'ALL') => dispatch(searchByCategory({ category })),
    searchByKeyandPhrase: (searchKey: (keyof typeof SearchKeys), searchPhrase: string) =>
      dispatch(searchByKeyandPhrase({ searchKey, searchPhrase })),
    updateDiscount: ( discount: number) => dispatch(updatePrice({ discount })),
    clearCart: () => dispatch(clearCart()),
    addToCart: (cartItem: CartItemProps) => dispatch(addToCart({ cartItem })),
    addQuantity: (productId: string) => dispatch(addQuantity({ productId })),
    subQuantity: (productId: string) => dispatch(subQuantity({ productId })),
  }
}
