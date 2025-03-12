import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Sale, transState } from '@typess/trans'
import { transService } from '@services/transService'

const initialState: transState = {
  sales: [],
  invoices: [],
  returns: [],
  salesReturns: [],
  purchases: [],
  purchaseReturn: [],
  success: null,
  error: null,
  loading: false,
  mainOpt: 'Sales',
  subOpt: 'None',
  sale: null,
  invoice: null,
  saleReturn: null,
}

export const fetchSales = createAsyncThunk('trans/fetchSales', async () => {
  const response = await transService.fetchSales()
  if ( response.status !== 'success') {
    throw new Error(response.message)
  }
  return { sales: response.data, successMsg: response.message }
})

export const fetchSale = createAsyncThunk('trans/fetchSale', async (id: string) => {
  const response = await transService.fetchSale(id)
  if ( response.status !== 'success') {
    throw new Error(response.message)
  }
  return { sale: response.data, successMsg: response.message }
})

export const processSale = createAsyncThunk('trans/processSale', async (data: Partial<Sale>) => {
  const response = await transService.makeSale(data)
  if ( response.status !== 'success') {
    throw new Error(response.message)
  }
  return { sale: response.data, successMsg: response.message }
})

export const updateSale = createAsyncThunk(
  'trans/updateSale',
  async ({ saleId, data }: { saleId: string; data: { status: string; businessId: string } }) => {
    const response = await transService.updateSale(saleId, data)
    if (response.status !== 'success') {
      throw new Error(response.message)
    }
    return { sale: response.data, successMsg: response.message }
  }
)

export const cancelSale = createAsyncThunk(
  'trans/cancelSale',
  async ({ saleId, data }: { saleId: string; data: { reason: string; businessId: string } }) => {
    const response = await transService.cancelSale(saleId, data)
    if (response.status !== 'success') {
      throw new Error(response.message)
    }
    return { sale: response.data, successMsg: response.message }
  }
)


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
    setSale: (state, action) => {
      state.sale = action.payload.sale
    },
    setInvoice: (state, action) => {
      state.invoice = action.payload.invoice
    },
    rmSale: (state) => {
      state.sale = null
      state.invoice = null
      state.subOpt = 'None'
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
        state.invoices = action.payload.sales.filter((sale: Sale) =>
          (sale.status === 'COMPLETED' || sale.status === 'PENDING')
        )
        state.salesReturns = action.payload.sales.filter((sale: Sale) =>
          (sale.refundStatus !== 'NONE')
        )
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Sales data could not be fetched, try again later'
        state.success = null
        state.sales = []
        state.invoices = []
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
    // Fetch single sale
    builder
      .addCase(fetchSale.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(fetchSale.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.success = action.payload.successMsg
        state.saleReturn = action.payload.sale
      })
      .addCase(fetchSale.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Sale could not be fetched, try again later'
        state.success = null
      })
      // Update sale
    builder
      .addCase(updateSale.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.successMsg
        state.sale = action.payload.sale
        state.sales = state.sales.map(sale => sale.id === action.payload.sale.id ? action.payload.sale : sale)
        state.invoices = state.sales.filter((sale: Sale) => (sale.status === 'COMPLETED' || sale.status === 'PENDING'))
        state.salesReturns = state.sales.filter((sale: Sale) => (sale.refundStatus !== 'NONE'))
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Sale update failed, try again later'
      })
    // Cancel sale
    builder
      .addCase(cancelSale.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(cancelSale.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.successMsg
        state.sale = action.payload.sale
        state.sales = state.sales.map(sale => sale.id === action.payload.sale.id ? action.payload.sale : sale)
        state.invoices = state.sales.filter((sale: Sale) => (sale.status === 'COMPLETED' || sale.status === 'PENDING'))
        state.salesReturns = state.sales.filter((sale: Sale) => (sale.refundStatus !== 'NONE'))
      })
      .addCase(cancelSale.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Sale cancellation failed, try again later'
      })

  }
})

export const { clearError, setMainOpt, setSubOpt, rmSale, setSale, setInvoice } = transSlice.actions
export default transSlice.reducer