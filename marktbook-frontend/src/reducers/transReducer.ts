import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Sale, transState } from '@typess/trans'
import { transService } from '@services/transService'

const initialState: transState = {
  sales: [],
  invoices: [],
  salesReturn: [],
  purchases: [],
  purchaseReturn: [],
  success: null,
  error: null,
  loading: false,
  mainOpt: 'Sales',
  subOpt: 'None',
  sale: null
}

export const fetchSales = createAsyncThunk('trans/fetchSales', async () => {
  const response = await transService.fetchSales()
  if ( response.status !== 'success') {
    throw new Error(response.message)
  }
  return { sales: response.data, successMsg: response.message }
})

export const processSale = createAsyncThunk('trans/processSale', async (data: Partial<Sale>) => {
  const response = await transService.makeSale(data)
  if ( response.status !== 'success') {
    throw new Error(response.message)
  }
  return { sale: response.data, successMsg: response.message }
})


const transSlice = createSlice({
  name: 'trans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.success = null
    },
    setMainOpt: (state, action) => {
      state.mainOpt = action.payload.option
    },
    setSubOpt: (state, action) => {
      state.subOpt = action.payload.option
    },
    rmSale: (state) => {
      state.sale = null
    }
  },
  extraReducers: (builder) => {
    // fetch sales
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.success = action.payload.successMsg
        state.sales = action.payload.sales
        state.invoices = action.payload.sales
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Sales data could not be fetched, try again later'
        state.success = null
      })
    // Process sale
    builder
      .addCase(processSale.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(processSale.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.success = action.payload.successMsg
        state.sale = action.payload.sale
      })
      .addCase(processSale.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Sale could not be processed, try again later'
        state.success = null
      })

  }
})

export const { clearError, setMainOpt, setSubOpt, rmSale } = transSlice.actions
export default transSlice.reducer