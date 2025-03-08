import { stocksState, Location, StockMovement } from '@typess/stocks'
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
  movements: [],
  setLocation: null
}

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async() => {
  const response = await stocksService.fetchStock()
  if (response.data.length === 0) {
    throw new Error(response.message)
  }
  return { stocks: response.data, successMsg: response.message }
})

export const createLocation = createAsyncThunk('stocks/createLocation', async(data: Partial<Location>) => {
  const response = await stocksService.createLocation(data)
  if (response.status === 'error') {
    throw new Error(response.message)
  }
  return { location: response.data, successMsg: response.message }
})

export const fetchLowStock = createAsyncThunk('stocks/fetchLowStock', async() => {
  const response = await stocksService.fetchLowStock()
  if (response.data.length === 0) {
    throw new Error(response.message)
  }
  return { lowStock: response.data, successMsg: response.message }
})

export const fetchStockBySupplier = createAsyncThunk('stocks/fetchStockBySupplier', async(supplierId: string) => {
  const response = await stocksService.fetchStocksBySupplier(supplierId)
  if (response.data.length === 0) {
    throw new Error(response.message)
  }
  return { stocks: response.data, successMsg: response.message }
})

export const fetchLocations = createAsyncThunk('stocks/fetchLocations', async() => {
  const response = await stocksService.fetchLocations()
  if (response.data.length === 0) {
    throw new Error(response.message)
  }
  return { locations: response.data, successMsg: response.message }
})

export const deleteLocation = createAsyncThunk('stocks/deleteLocation', async(id: string) => {
  const response = await stocksService.deleteLocation(id)
  if (response.status !== 'success') {
    throw new Error(response.message)
  }
  return { locationId: id, successMsg: response.message }
})

export const editLocation = createAsyncThunk('stocks/editLocation', async({ id, data }: { id: string, data: Partial<Location> }) => {
  const response = await stocksService.editLocation(id, data)
  if (response.status !== 'success') {
    throw new Error(response.message)
  }
  return { location: response.data, successMsg: response.message }
})

export const createMovement = createAsyncThunk('stocks/createMovement', async(data: Partial<StockMovement>) => {
  const response = await stocksService.newMovement(data)
  if (response.status !== 'success') {
    throw new Error(response.message)
  }
  const locations = await stocksService.fetchLocations()
  return { locations: locations.data, successMsg: response.message }
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
    stLocation: (state, action) => {
      state.setLocation = action.payload.location
    },
    rmLocation: (state) => {
      state.setLocation = null
      state.subOpt = 'None'
    },
    resetSupplier: (state) => {
      state.subOpt = 'None'
      state.bySupplier = []
    }
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
    // Create Location
    builder
      .addCase(createLocation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.locations = [...state.locations, action.payload.location]
        state.movements = state.locations
          .flatMap((location: Location) => location.stockMovements)
        state.success = action.payload.successMsg
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.loading = false
        state.locations = []
        state.movements = []
        state.error = action.error.message as string ||
    'Location could not be created, try again later'
      })
    // Create Movement
    builder
      .addCase(createMovement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createMovement.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.locations = action.payload.locations
        state.movements = state.locations
          .flatMap((location: Location) => location.stockMovements)
        state.success = action.payload.successMsg
      })
      .addCase(createMovement.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message as string ||
  'Movement could not be completed, try again later'
      })
      // Edit Location
    builder
      .addCase(editLocation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(editLocation.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.locations = state.locations.map(location =>
          location.id === action.payload.location.id ? action.payload.location : location )
        state.success = action.payload.successMsg
      })
      .addCase(editLocation.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message as string ||
    'Location data could not be edited, try again later'
      })
    // Delete Location
    builder
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.locations = state.locations.filter(location => location.id !== action.payload.locationId )
        state.movements = state.locations
          .flatMap((location: Location) => location.stockMovements)
        state.success = action.payload.successMsg
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message as string ||
  'Location data could not be deleted, try again later'
      })
    // Fetch stocks by supplier
    builder
      .addCase(fetchStockBySupplier.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStockBySupplier.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.bySupplier = action.payload.stocks
        state.success = action.payload.successMsg
      })
      .addCase(fetchStockBySupplier.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.bySupplier = []
        state.error = action.error.message as string ||
    'Stock by supplier data could not be fetched, try again later'
      })
  }
})


export const { clearError, setMainOpt, setSubOpt, resetSupplier, stLocation, rmLocation } = stockSlice.actions
export default  stockSlice.reducer