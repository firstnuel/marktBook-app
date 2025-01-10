import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthState, LoginData, RegisterData } from '../types/auth'
import { authService } from '@services/authService'

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  registered: null
}

export const login = createAsyncThunk('auth/loginUser', async (userData: LoginData) => {
  const response = await authService.login(userData)
  if (response.status !== 200) {
    throw new Error(response.data.message)
  }
  return response.data.data
})

export const logout = createAsyncThunk('auth/logoutUser', async () => {
  const response = await authService.logout()
  if (response.status !== 200) {
    throw new Error(response.data.message)
  }
})

export const register = createAsyncThunk('auth/register', async (registerData: RegisterData) => {
  const response = await authService.register(registerData)
  if (response.status !== 200) {
    throw new Error(response.data.message)
  }
  const businessData =  response.data.data.json()
  localStorage.setItem('businessData', businessData)
})


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.error = null
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? 'User login failed'
    })

    //logout
    builder.addCase(logout.fulfilled, (state) => {
      state.error = null
      state.user = null
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.error.message ?? 'User logout failed'
    })

    //register
    builder.addCase(register.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false
      state.error = null
      state.registered = true
    })
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? 'Business registeration failed'
      state.registered = false
    })

  }
})


export const { clearError } = authSlice.actions
export default authSlice.reducer