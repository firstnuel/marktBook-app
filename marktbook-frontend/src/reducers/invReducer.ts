import { EditStockData, invState, IProduct, IStockData } from '@typess/inv'
import { inventoryService } from '@services/inventoryService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState: invState = {
  mainOpt: 'Products',
  subOpt: 'Product List',
  product: null,
  productsByCat: [],
  stock: null,
  error: null,
  loading: false,
  success: false,
  successMsg: null
}

export const fetchProduct = createAsyncThunk('inv/getProduct', async (productId: string) => {
  const response = await inventoryService.fetchProduct(productId)
  if (!response.data) {
    throw new Error(response.message)
  }

  return { product: response.data, successMsg: response.message }
})

export const fetchProductsByCat = createAsyncThunk('inv/getProductsByCat', async (category: string) => {
  const response = await inventoryService.fetchProductsByCat(category)
  if (response.message === 'No product found') {
    throw new Error(`${response.message} for ${category}`)
  } else if (response.status === 'status') {
    throw new Error(response.message)
  }

  return { products: response.data, successMsg: response.message }
})


export const fetchStock = createAsyncThunk('inv/getStockData', async (productId: string) => {
  const response = await inventoryService.fetchStock(productId)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { stock: response.data,  successMsg: response.message }
})

export const updateProduct = createAsyncThunk('inv/updateProduct', async ({ productId, data }: { productId: string, data: IProduct }) => {
  const response = await inventoryService.updateProduct(productId, data)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { product: response.data,  successMsg: response.message }
})

export const updateStock = createAsyncThunk('inv/updateStock', async ({ productId, data }: { productId: string, data: EditStockData }) => {
  const response = await inventoryService.updateStock(productId, data)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { stock: response.data,  successMsg: response.message }
})

export const deleteProduct = createAsyncThunk('inv/deleteProduct', async (productId: string) => {
  const response = await inventoryService.deleteProduct(productId)
  if (response.status !== 'success') {
    throw new Error(response.error)
  }

  return { product: response.data, successMsg: response.message }
})

export const createProduct = createAsyncThunk('inv/createProduct', async ({ data }:  { data: IProduct }) => {
  const response = await inventoryService.createProduct(data)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { product: response.data,  successMsg: response.message }
})

export const addStock = createAsyncThunk('inv/addStock', async ({ data }:  { data: IStockData }) => {
  const response = await inventoryService.addStock(data)
  if (!response.data) {
    throw new Error(response.data.message)
  }

  return { stock: response.data,  successMsg: response.message }
})


const invSlice = createSlice({
  name: 'inv',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.success = false
      state.loading = false
      state.successMsg = null
    },
    setLoading: (state) => {
      state.loading = true
    },
    rmPrdStck: (state) => {
      state.product = null
      state.stock = null
      state.subOpt = 'Product List'
      state.loading = false
      state.success = false
      state.successMsg = null
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
    },
    resetCat: (state) => {
      state.productsByCat = []
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
      state.successMsg = action.payload.successMsg
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
      state.successMsg = action.payload.successMsg
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
      state.successMsg = action.payload.successMsg
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
      state.successMsg = action.payload.successMsg
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
      state.successMsg = action.payload.successMsg
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
      state.success = false
    })
    builder.addCase(updateStock.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.stock = action.payload.stock
      state.successMsg = action.payload.successMsg
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
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.successMsg = action.payload.successMsg
      state.product = null
      state.success = true
    })
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.error = action.error.message as string ||
          'Product could not be deleted, try again later'
    })
    builder.addCase(fetchProductsByCat.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProductsByCat.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.successMsg = action.payload.successMsg
      state.productsByCat = action.payload.products
      state.success = true
    })
    builder.addCase(fetchProductsByCat.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.error = action.error.message as string ||
          'Product by category could not be fetched, try again later'
    })
  }
})

export const { clearError, setMainOpt, setLoading, setSubOpt, resetOpt, rmPrdStck, resetCat } = invSlice.actions
export default invSlice.reducer