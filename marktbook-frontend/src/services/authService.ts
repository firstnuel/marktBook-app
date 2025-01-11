import axios, { AxiosResponse } from 'axios'
import { LoginData, RegisterData, passwordData } from '../types/auth'


class AuthService {
  private readonly BASE_PATH = import.meta.env.VITE_API_URL

  public async login(userData: LoginData): Promise<AxiosResponse> {
    try {
      // Add a 3-second delay
      //await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await axios.post(`${this.BASE_PATH}/login`, userData)
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

      const response = await axios.post(`${this.BASE_PATH}/reset-password/${token}`, passwordData)
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
      const response = await axios.post(`${this.BASE_PATH}/forgot-password`, { email })
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
    const response = await axios.get(`${this.BASE_PATH}/logout`)
    return response.data
  }

  public async register(registerData: RegisterData): Promise<AxiosResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await axios.post(`${this.BASE_PATH}/register`, registerData)
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