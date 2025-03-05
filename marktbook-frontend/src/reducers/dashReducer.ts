import { dashboardState, QueryPeriod, Summary } from '@typess/dashboard'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { transService } from '@services/transService'

const initialState: dashboardState = {
  data:  null,
  period: 'monthly',
  success: null,
  error: null,
  loading: false,
}

interface FetchQuery {
    businessId: string,
    period: QueryPeriod
}

export const fetchSummary = createAsyncThunk('dash/fetchSummary',
  async ({ businessId, period }: FetchQuery ) => {
    const response = await transService.fetchSummary(businessId, period)
    if ( response.status !== 'success') {
      throw new Error(response.message)
    }
    return { summary: response.summaryData as Summary, successMsg: response.message }
  })

const dashSlice = createSlice({
  name: 'dash',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.success = null
    },
    setPeriod: (state, action) => {
      state.period = action.payload.period
    },
  },
  extraReducers: (builder) => {
    // fetch summary
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.success = action.payload.successMsg
        state.data = action.payload.summary

      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Sales data could not be fetched, try again later'
        state.success = null
      })

  }
})


export const { setPeriod, clearError } = dashSlice.actions
export default dashSlice.reducer
