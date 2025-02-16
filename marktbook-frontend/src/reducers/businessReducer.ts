import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { businessService } from '@services/businessService'
import { User } from '@typess/auth'
import { BusinessState, Business } from '@typess/bizness'

const initialState: BusinessState =  {
  mainOpt: 'Business',
  subOpt: 'None',
  business: null,
  success: null,
  error: null,
  loading: false,
  users: [],
  user: null
}

export const fetchBusiness = createAsyncThunk('business/fetchBusiness', async (businessId: string) => {
  const response = await businessService.fetchBusiness(businessId)
  if (!response.data) {
    throw new Error(response.message)
  }
  return { business: response.data, message: response.message }
})

export const fetchUser = createAsyncThunk('business/fetchUser', async (userId: string) => {
  const response = await businessService.fetchUser(userId)
  if (!response.data) {
    throw new Error(response.message)
  }
  return { user: response.data, message: response.message }
})

export const createUser = createAsyncThunk('business/createUser', async (data: Partial<User>) => {
  const response = await businessService.createUser(data)
  if (!response.data) {
    throw new Error(response.message)
  }
  return { user: response.data, message: response.message }
})

export const fetchBusinessUsers = createAsyncThunk('business/fetchBusinessUsers', async () => {
  const response = await businessService.fetchUsers()
  if (!response.data) {
    throw new Error(response.message)
  }
  return { users: response.data, message: response.message }
})

export const update = createAsyncThunk('business/updateBusiness',
  async ({ businessId, data }: { businessId: string, data: Partial<Business>}) => {
    const response = await businessService.updateBusiness(businessId, data)
    if (!response.data) {
      throw new Error(response.message)
    }
    return { business: response.data, message: response.message }
  })

export const updateUser = createAsyncThunk('business/updateUser',
  async ({ userId, data }: { userId: string, data: Partial<User>}) => {
    const response = await businessService.updateUser(userId, data)
    if (!response.data) {
      throw new Error(response.message)
    }
    return { user: response.data, message: response.message }
  })

const businessSlice = createSlice({
  name: 'business',
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
    rmUser: (state) => {
      state.user = null
      state.subOpt = 'None'
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
    builder.addCase(fetchBusinessUsers.pending, (state) => {
      state.loading = true
      state.error = null
      state.success = null
    })
    builder.addCase(fetchBusinessUsers.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.success = action.payload.message
      state.users = action.payload.users
    })
    builder.addCase(fetchBusinessUsers.rejected, (state, action) => {
      state.loading = false
      state.success = null
      state.users = []
      state.error = action.error.message || 'Business users could not be fetched, try again later'
    })
    builder.addCase(update.pending, (state) => {
      state.loading = true
      state.error = null
      state.success = null
    })
    builder.addCase(update.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.success = action.payload.message
      state.business = action.payload.business
    })
    builder.addCase(update.rejected, (state, action) => {
      state.loading = false
      state.success = null
      state.error = action.error.message || 'Business data could not be updated, try again later'
    })
    builder.addCase(createUser.pending, (state) => {
      state.loading = true
      state.error = null
      state.success = null
    })
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.success = action.payload.message
      state.users = [...state.users, action.payload.user]
    })
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false
      state.success = null
      state.error = action.error.message || 'User could not be created, try again later'
    })
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true
      state.error = null
      state.success = null
    })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.success = action.payload.message
      state.user = action.payload.user
    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.success = null
      state.error = action.error.message || 'User data could not be fetched, try again later'
    })
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true
      state.error = null
      state.success = null
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.success = action.payload.message
      state.user = action.payload.user
    })
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false
      state.success = null
      state.error = action.error.message || 'User data could not be updated, try again later'
    })
  }
})



export const { clearError, setMainOpt, setSubOpt, rmUser } = businessSlice.actions
export default businessSlice.reducer