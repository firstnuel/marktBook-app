import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { businessService } from '@services/businessService'
import { BusinessState } from '@typess/bizness'

const initialState: BusinessState =  {
  business: null,
  success: null,
  error: null,
  loading: false
}

export const fetchBusiness = createAsyncThunk('business/fetchBusiness', async (businessId: string) => {
  const response = await businessService.fetchBusiness(businessId)
  if (!response.data) {
    throw new Error(response.message)
  }
  return { business: response.data, message: response.message }
})

export const updateCategory = createAsyncThunk('business/updateCategory',
  async ({ businessId, data }: { businessId: string, data: { customCategories: string[] }}) => {
    const response = await businessService.updateCategory(businessId, data)
    if (!response.data) {
      throw new Error(response.message)
    }
    return { business: response.data, message: response.message }
  })

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.success = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBusiness.pending, (state) => {
      state.loading = true
      state.error = null
      state.success = null
    })
    builder.addCase(fetchBusiness.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.success = action.payload.message
      state.business = action.payload.business
    })
    builder.addCase(fetchBusiness.rejected, (state, action) => {
      state.loading = false
      state.success = null
      state.error = action.error.message || 'Business data could not be fetched, try again later'
    })
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true
      state.error = null
      state.success = null
    })
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.success = action.payload.message
      state.business = action.payload.business
    })
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.loading = false
      state.success = null
      state.error = action.error.message || 'Business data could not be updated, try again later'
    })
  }
})



export const { clearError } = businessSlice.actions
export default businessSlice.reducer