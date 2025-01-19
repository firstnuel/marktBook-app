import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { LoginData, RegisterData, passwordData } from '../types/auth'

export let Token: string
export const setToken = (token: string) => {
  Token = token
}

class AuthService {
  private readonly BASE_PATH = import.meta.env.VITE_API_URL
  private readonly axios: AxiosInstance

  constructor () {
    this.axios = axios.create({
      baseURL: this.BASE_PATH,
      withCredentials: true,
    })
  }

  public async login(userData: LoginData): Promise<AxiosResponse> {
    try {
      // Add a 3-second delay
      //await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await this.axios.post('/login', userData)
      return response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data.message
        throw new Error(errMsg)
      }
      throw error
    }
  }

  public async getUser(): Promise<AxiosResponse> {
    try {
      const response = await this.axios.get('/me')
      return response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data.message
        throw new Error(errMsg)
      }
      throw error
    }
  }

  public async updatePassword(passwordData: passwordData, token: string): Promise<AxiosResponse> {
    try {
      const response = await this.axios.post(`/reset-password/${token}`, passwordData)
      return response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data.message
        throw new Error(errMsg)
      }
      throw error
    }
  }

  public async passwordReset (email: string) :  Promise<AxiosResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const response = await this.axios.post('$/forgot-password', { email })
      return response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data.message
        throw new Error(errMsg)
      }
      throw error
    }
  }

  public async logout(): Promise<AxiosResponse> {
    const response = await this.axios.get('/logout')
    return response
  }

  public async register(registerData: RegisterData): Promise<AxiosResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await this.axios.post('$/register', registerData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data.message
        throw new Error(errMsg)
      }
      throw error
    }

  }
}


export const authService = new AuthService()