import { stocksState, Location } from '@typess/stocks'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { stocksService } from '@services/stocksService'

const initialState: stocksState = {
  stocks: [],
  error: null,
  success: null,
  loading: false,
  mainOpt: 'Stocks',
  subOpt: 'None',
  lowStocks: [],
  bySupplier: [],
  locations: [],
  movements: []
}

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async() => {
  const response = await stocksService.fetchStock()
  if (response.data.length === 0) {
    throw new Error(response.message)
  }
  return { stocks: response.data, successMsg: response.message }
})

export const fetchLowStock = createAsyncThunk('stocks/fetchLowStock', async() => {
  const response = await stocksService.fetchLowStock()
  if (response.data.length === 0) {
    throw new Error(response.message)
  }
  return { lowStock: response.data, successMsg: response.message }
})


export const fetchLocations = createAsyncThunk('stocks/fetchLocations', async() => {
  const response = await stocksService.fetchLocations()
  if (response.data.length === 0) {
    throw new Error(response.message)
  }
  return { locations: response.data, successMsg: response.message }
})

const stockSlice = createSlice({
  name: 'stocks',
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
  },
  extraReducers: (builder) => {
    // Fetch stock data
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.stocks = action.payload.stocks
        state.success = action.payload.successMsg
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false
        state.stocks = []
        state.error = action.error.message as string ||
        'Stocks data could not be fetched, try again later'
      })
    // Fetch Low stock
    builder
      .addCase(fetchLowStock.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.lowStocks = action.payload.lowStock
        state.success = action.payload.successMsg
      })
      .addCase(fetchLowStock.rejected, (state, action) => {
        state.loading = false
        state.lowStocks = []
        state.error = action.error.message as string ||
        'Stocks data could not be fetched, try again later'
      })
    // Fetch Locations
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.locations = action.payload.locations
        state.movements = action.payload.locations
          .flatMap((location: Location) => location.stockMovements)
        state.success = action.payload.successMsg
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false
        state.locations = []
        state.movements = []
        state.error = action.error.message as string ||
      'Location data could not be fetched, try again later'
      })
  }
})


export const { clearError, setMainOpt, setSubOpt } = stockSlice.actions
export default  stockSlice.reducer