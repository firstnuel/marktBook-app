import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { inventoryService } from '@services/inventoryService'
import { PosState } from '@typess/pos'
import { calculatePrice, updateDiscount } from '@utils/helpers'
import { ProductCategory } from '@typess/pos'

const initialState: PosState = {
  products: [],
  cartItems: [],
  filteredProducts: [],
  category: 'ALL',
  searchPhrase: '',
  searchKey: 'SKU',
  loading: false,
  successMsg: null,
  customer: null,
  error: null,
  priceInfo: {
    subtotal: 0,
    total: 0,
    discount: 0,
    tax: 0
  },
  taxRate: null
}

export const fetchProducts = createAsyncThunk('pos/products', async() => {
  const response = await inventoryService.fetchProducts()
  if (response.data.length === 0) {
    throw new Error(response.message)
  }
  return { products: response.data, successMsg: response.message }
})

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    setTaxRate: (state, action) => {
      state.taxRate = action.payload.taxRate
    },
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
    searchByCategory: (state, action) => {
      const category = action.payload.category
      state.category = category
      if (category === 'ALL') {
        state.filteredProducts = [...state.products]
      } else if (Object.values(ProductCategory).includes(category)) {
        state.filteredProducts = state.products.filter(
          product => product.productCategory === category
        )
      } else {
        state.filteredProducts = []
      }
    },
    searchByKeyandPhrase: (state, action) => {
      const { searchKey, searchPhrase } = action.payload
      const normalizedPhrase = searchPhrase.toLowerCase()

      // Decide whether to apply the filter to the entire product list or the filtered list
      const sourceProducts = state.category === 'ALL' ? state.products : state.filteredProducts

      switch (searchKey) {
      case 'SKU':
        state.filteredProducts = sourceProducts.filter(product =>
          product.sku.toLowerCase() === normalizedPhrase
        )
        break
      case 'Product Name':
        state.filteredProducts = sourceProducts.filter(product =>
          product.productName.toLowerCase().includes(normalizedPhrase)
        )
        break
      case 'Product Tag':
        state.filteredProducts = sourceProducts.filter(product =>
          Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(normalizedPhrase))
        )
        break
      case 'Category':
        state.filteredProducts = sourceProducts.filter(product =>
          product.productCategory.toLowerCase().includes(normalizedPhrase)
        )
        break
      case 'Barcode':
        state.filteredProducts = sourceProducts.filter(product =>
          product.barcode.toLowerCase() === normalizedPhrase
        )
        break
      default:
        console.warn(`Invalid search key: ${searchKey}`)
        // Decide whether to clear the filter or keep existing results
        state.filteredProducts = [...state.products]
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
        state.priceInfo = calculatePrice(state.cartItems, state.taxRate ?? undefined)
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
        state.priceInfo = calculatePrice(state.cartItems, state.taxRate ?? undefined)
      }
    },
    updatePrice: (state, action) => {
      const newDiscount = action.payload.discount
      state.priceInfo = { ...state.priceInfo, discount: newDiscount }
      state.priceInfo = updateDiscount(state.priceInfo, newDiscount, state.taxRate ?? undefined)
    },
    clearError: (state) => {
      state.error = null
      state.successMsg = null
    },
    clearCart: (state) => {
      state.cartItems = []
      state.priceInfo = calculatePrice(state.cartItems, state.taxRate ?? undefined)
      state.customer = null
    },
    setCustomer: (state, action) => {
      state.customer = action.payload.customer
    },
    rmCustomer: (state) => {
      state.customer = null
    },
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
      state.filteredProducts = action.payload.products
      state.successMsg = action.payload.successMsg
    })
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false
      state.products = []
      state.error = action.error.message as string ||
      'Products data could not be fetched, try again later'
    })
  }

})

export const {
  addToCart,
  setCustomer,
  setTaxRate,
  clearCart,
  rmCustomer,
  clearError,
  addQuantity,
  subQuantity,
  updatePrice,
  searchByCategory,
  searchByKeyandPhrase
} = posSlice.actions
export default posSlice.reducer