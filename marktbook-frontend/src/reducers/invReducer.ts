import { EditStockData, invState, IProduct, IStockData } from '@typess/inv'
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

export const fetchStock = createAsyncThunk('inv/getStockData', async (productId: string) => {
  const response = await inventoryService.fetchStock(productId)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { stock: response.data }
})

export const updateProduct = createAsyncThunk('inv/updateProduct', async ({ productId, data }: { productId: string, data: IProduct }) => {
  const response = await inventoryService.updateProduct(productId, data)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { product: response.data }
})

export const updateStock = createAsyncThunk('inv/updateStock', async ({ productId, data }: { productId: string, data: EditStockData }) => {
  const response = await inventoryService.updateStock(productId, data)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { stock: response.data }
})

export const deleteProduct = createAsyncThunk('inv/deleteProduct', async (productId: string) => {
  const response = await inventoryService.deleteProduct(productId)
  if (response.status !== 'success') {
    throw new Error(response.error)
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

export const addStock = createAsyncThunk('inv/addStock', async ({ data }:  { data: IStockData }) => {
  const response = await inventoryService.addStock(data)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { stock: response.data }
})


const invSlice = createSlice({
  name: 'inv',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.success = false
      state.loading = false
    },
    setLoading: (state) => {
      state.loading = true
    },
    rmPrdStck: (state) => {
      state.product = null
      state.stock = null
      state.subOpt = 'Product List'
    },
    resetOpt: (state) => {
      state.mainOpt = 'Products'
      state.subOpt = 'Product List'
      state.product = null
      state.error = null
      state.stock = null
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
      state.success = true
    })
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message as string ||
          'Product data could not be fetched, try again later'
    })
    builder.addCase(fetchStock.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchStock.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.stock = action.payload.stock
      state.success = true
    })
    builder.addCase(fetchStock.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message as string ||
          'Stock data could not be fetched, try again later'
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
    builder.addCase(addStock.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(addStock.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.stock = action.payload.stock
      state.success = true
    })
    builder.addCase(addStock.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.error = action.error.message as string ||
          'Stock data could not be added to product, try again later'
    })
    builder.addCase(updateStock.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateStock.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.stock = action.payload.stock
      state.success = true
    })
    builder.addCase(updateStock.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.error = action.error.message as string ||
          'Stock data could not be updated, try again later'
    })
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteProduct.fulfilled, (state) => {
      state.loading = false
      state.error = null
      state.product = null
      state.success = true
    })
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.error = action.error.message as string ||
          'Product could not be deletes, try again later'
    })
  }
})

export const { clearError, setMainOpt, setLoading, setSubOpt, resetOpt, rmPrdStck } = invSlice.actions
export default invSlice.reducer