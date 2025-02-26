import { useEffect, useCallback, ChangeEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  clearCart,
  clearError,
  addToCart,
  fetchProducts,
  setCustomer,
  addQuantity,
  rmCustomer,
  subQuantity,
  updatePrice,
  setTaxRate,
  searchByCategory,
  searchByKeyandPhrase,
  selectPaymentMethod,
} from '@reducers/posReducers'
import { CartItemProps, ProductCategory, SearchKeys } from '@typess/pos'
import { Customer } from '@typess/contacts'

type CE = ChangeEvent<HTMLSelectElement>

export const usePos = () => {
  const dispatch = useAppDispatch()

  const {
    products,
    cartItems,
    searchPhrase,
    filteredProducts,
    searchKey,
    loading,
    customer,
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


  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])

  const rmCustomerHandler = useCallback(() => dispatch(rmCustomer()), [dispatch])

  const fetchProductsHandler = useCallback(() => dispatch(fetchProducts()), [dispatch])

  const selectPaymentHandler = useCallback(
    (e: CE) => dispatch(selectPaymentMethod({ paymentMathod: e.target.value })),
    [dispatch])

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

  const setCustomerHandler = useCallback(
    (customer: Customer) => dispatch(setCustomer({ customer })),
    [dispatch]
  )

  const setTaxRateHandler = useCallback(
    (taxRate: number) => dispatch(setTaxRate({ taxRate })),
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
    customer,
    selectPaymentMethod: selectPaymentHandler,
    setTaxRate: setTaxRateHandler,
    setCustomer: setCustomerHandler,
    rmCustomer: rmCustomerHandler,
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
