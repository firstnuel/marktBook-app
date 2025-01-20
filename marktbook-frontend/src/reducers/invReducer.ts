import { invState, IProduct } from '@typess/inv'
import { inventoryService } from '@services/inventoryService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState: invState = {
  mainOpt: 'Products',
  subOpt: 'Product List',
  product: null,
  stock: null,
  error: null,
  loading: false,
  success: false,
}

export const fetchProduct = createAsyncThunk('inv/getProduct', async (productId: string) => {
  const response = await inventoryService.fetchProduct(productId)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { product: response.data }
})

export const updateProduct = createAsyncThunk('inv/updateProduct', async ({ productId, data }: { productId: string, data: IProduct }) => {
  const response = await inventoryService.updateProduct(productId, data)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { product: response.data }
})

export const createProduct = createAsyncThunk('inv/createProduct', async ({ data }:  { data: IProduct }) => {
  const response = await inventoryService.createProduct(data)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { product: response.data }
})

const invSlice = createSlice({
  name: 'inv',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetOpt: (state) => {
      state.mainOpt = 'Products'
      state.subOpt = 'Product List'
      state.product = null
      state.error = null
      state.loading = false
      state.success = false
    },
    setMainOpt: (state, action) => {
      state.mainOpt = action.payload.option
    },
    setSubOpt: (state, action) => {
      state.subOpt = action.payload.option
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.product = action.payload.product
    })
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message as string ||
          'Product data could not be fetched, try again later'
    })
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.product = action.payload.product
      state.success = true
    })
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.error = action.error.message as string ||
          'Product data could not be updated, try again later'
    })
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.product = action.payload.product
      state.success = true
    })
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.error = action.error.message as string ||
          'Product data could not be created, try again later'
    })
  }
})

export const { clearError, setMainOpt, setSubOpt, resetOpt } = invSlice.actions
export default invSlice.reducer