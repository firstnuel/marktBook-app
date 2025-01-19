import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthState, LoginData, RegisterData, passwordData } from '../types/auth'
import { authService } from '@services/authService'
import { setToken } from '@services/authService'
import { persistor, RESET_ALL } from '../store'

const initialState: AuthState = {
  user: null,
  userToken: null,
  loading: false,
  error: null,
  registered: null,
  reset: false,
  updated: null
}

export const fetchUser = createAsyncThunk( 'auth/fetchUser', async () => {
  const response = await authService.getUser()
  if (response.status !== 200) {
    throw new Error(response.data.message)
  }
  return response.data.user
}
)

export const login = createAsyncThunk('auth/loginUser', async (userData: LoginData) => {
  const response = await authService.login(userData)
  if (response.status !== 200) {
    throw new Error(response.data.message)
  }
  const userToken = response.data.token
  setToken(userToken)
  return userToken
})


export const logout = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  const response = await authService.logout()
  if (response.status !== 200) {
    throw new Error(response.data.message)
  }
  dispatch({ type: RESET_ALL })
  await persistor.purge()

  return response.data
})

export const register = createAsyncThunk('auth/register', async (registerData: RegisterData) => {
  const response = await authService.register(registerData)
  if (response.status !== 201) {
    throw new Error(response.data.message)
  }
  const businessData =  response.data.data
  localStorage.setItem('businessData', businessData)
  return businessData
})

export const passwordReset = createAsyncThunk('auth/passwordReset', async(email: string) => {
  const response = await authService.passwordReset(email)
  if (response.status !== 200) {
    throw new Error(response.data.message)
  }
})

export const passwordUpdate = createAsyncThunk('auth/passwordUpdate', async (passwordData: { passwordData: passwordData, token: string }) => {
  const response = await authService.updatePassword(passwordData.passwordData, passwordData.token)
  if (response.status !== 200) {
    throw new Error(response.data.message)
  }
})


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.userToken = action.payload
      state.error = null
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'User login failed, Try again later'
    })

    //logout
    builder.addCase(logout.fulfilled, (state) => {
      state.error = null
      state.userToken = null
      state.user = null
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.error.message ||'User logout failed, Try again later'
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
      state.error = action.error.message ||'Business registeration failed, Try again later'
      state.registered = false
    })

    // password reset
    builder.addCase(passwordReset.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(passwordReset.fulfilled, (state) => {
      state.loading = false
      state.error = null
      state.reset = true
    })
    builder.addCase(passwordReset.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ||'Password reset failed, Try again later'
      state.reset = false
    })

    // password update
    builder.addCase(passwordUpdate.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(passwordUpdate.fulfilled, (state) => {
      state.loading = false
      state.error = null
      state.updated = true
    })
    builder.addCase(passwordUpdate.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ||'Password update failed, Try again later'
      state.updated = false
    })

    // Add cases for fetchUser
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.error = null
    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch user data'
    })
  }
})





export const { clearError } = authSlice.actions
export default authSlice.reducer