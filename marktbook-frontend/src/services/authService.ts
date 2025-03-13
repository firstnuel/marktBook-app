/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import { LoginData, RegisterData, passwordData } from '../types/auth'



class AuthService {
  private readonly BASE_PATH = import.meta.env.VITE_API_URL
  private readonly axios: AxiosInstance

  constructor () {
    this.axios = axios.create({
      baseURL: this.BASE_PATH,
      withCredentials: true,
    })
  }

  private handleAxiosError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || defaultMessage
      throw new Error(errMsg)
    }
    throw error
  }


  public async login(userData: LoginData): Promise<any> {
    try {
      // Add a 3-second delay
      //await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await this.axios.post('/login', userData)
      return response
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while logging in user')
    }
  }

  public async getUser(): Promise<any> {
    try {
      const response = await this.axios.get('/me',)
      return response
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching user')
    }
  }

  public async updatePassword(passwordData: passwordData, token: string): Promise<any> {
    try {
      const response = await this.axios.post(`/reset-password/${token}`, passwordData)
      return response
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while updating user password')
    }
  }

  public async passwordReset (email: string) :  Promise<any> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const response = await this.axios.post('/forgot-password', { email })
      return response
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while perfoming user password reset')
    }
  }

  public async logout(): Promise<any> {
    try {
      const response = await this.axios.get('/logout')
      return response
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while logging out user')
    }

  }

  public async register(registerData: RegisterData): Promise<any> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await this.axios.post('/register', registerData)
      return response
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while registering user')
    }

  }
}


export const authService = new AuthService()