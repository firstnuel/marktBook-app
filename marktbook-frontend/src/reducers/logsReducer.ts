import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { logsService } from '@services/logsService'
import { Log, LogsState } from '@typess/logs'


const initialState: LogsState =  {
  mainOpt: 'Inventory',
  inventory: [],
  stock: [],
  transaction: [],
  contacts: [],
  business: [],
  users: [],
  success: null,
  error: null,
  loading: false,
}

export const fetchLogs = createAsyncThunk('contacts/fetchLogs', async () => {
  const response = await logsService.fetchLogs()
  if (!response.data) {
    throw new Error(response.message)
  }
  return { logs: response.data as Log[], message: response.message }
})


const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.success = null
    },
    setMainOpt: (state, action) => {
      state.mainOpt = action.payload.option
    },
  },
  extraReducers: (builder) => {
    // Fetch Logs
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true
        state.success = null
        state.error = null
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.inventory = action.payload.logs.filter(log =>
          log.entity === 'PRODUCT'
        )
        state.stock = action.payload.logs.filter(log =>
          (log.entity === 'STOCK' || log.entity === 'LOCATION')
        )
        state.transaction = action.payload.logs.filter(log =>
          (log.entity === 'TRANSACTION' || log.entity === 'SALE')
        )
        state.users = action.payload.logs.filter(log =>
          log.entity === 'USER'
        )
        state.contacts = action.payload.logs.filter(log =>
          (log.entity === 'SUPPLIER' || log.entity === 'CUSTOMER')
        )
        state.business = action.payload.logs.filter(log =>
          log.entity === 'BUSINESS'
        )
        state.success = action.payload.message
        state.loading = false
        state.error = null
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message || 'Logs data could not be fetched, try again later'
      })
  }
})

export const { clearError, setMainOpt } = logsSlice.actions
export default logsSlice.reducer