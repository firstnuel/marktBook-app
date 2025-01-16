import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { inventoryService } from '@services/inventoryService'
import { PosState } from '@typess/pos'
import { calculatePrice, updateDiscount } from '@utils/helpers'

const initialState: PosState = {
  products: [],
  cartItems: [],
  category: 'ALL',
  searchPhrase: '',
  searchKey: 'SKU',
  loading: false,
  error: null,
  priceInfo: {
    subtotal: 0,
    total: 0,
    discount: 0,
    tax: 0
  }

}

export const fetchProducts = createAsyncThunk('pos/products', async() => {
  const response = await inventoryService.fetchProducts()
  if (response.data.length === 0) {
    throw new Error(response.data.message)
  }

  return { products: response.data }
})

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const cartItem = action.payload.cartItem
      const itemExist = state.cartItems.find(item => item.product.id === cartItem.product.id)
      if (itemExist) {
        state.cartItems = state.cartItems.map(item =>
          item.product.id === cartItem.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        state.priceInfo = calculatePrice(state.cartItems)
      } else {
        state.cartItems = [...state.cartItems, cartItem]
        state.priceInfo = calculatePrice(state.cartItems)
      }
    },
    addQuantity: (state, action) => {
      const productId = action.payload.productId
      const itemExist = state.cartItems.find(item => item.product.id === productId)
      if (itemExist) {
        state.cartItems = state.cartItems.map(item =>
          item.product.id === productId ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        state.priceInfo = calculatePrice(state.cartItems)
      }
    },
    subQuantity: (state, action) => {
      const productId = action.payload.productId
      const itemExist = state.cartItems.find(item => item.product.id === productId)
      if (itemExist) {
        state.cartItems = state.cartItems.map(item =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        state.priceInfo = calculatePrice(state.cartItems)
      }
    },
    updatePrice: (state, action) => {
      const newDiscount = action.payload.discount
      state.priceInfo = { ...state.priceInfo, discount: newDiscount }
      state.priceInfo = updateDiscount(state.priceInfo, newDiscount)
    },
    clearError: (state) => {
      state.error = null
    },
    clearCart: (state) => {
      state.cartItems = []
      state.priceInfo = calculatePrice(state.cartItems)
    }
  },
  extraReducers: (builder) => {
    //fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.products = action.payload.products
    })
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message as string ||
      'Products data could not be fetched, try again later'
    })
  }

})



export const { addToCart, clearCart, clearError, addQuantity, subQuantity, updatePrice } = posSlice.actions
export default posSlice.reducer