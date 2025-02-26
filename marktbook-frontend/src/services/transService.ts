/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import { Token } from './authService'
import { Sale } from '@typess/trans'


class TransService {
  private readonly BASE_PATH: string = import.meta.env.VITE_API_URL
  private readonly axios: AxiosInstance
  private headers = {
    'Accept': 'application/json',
  }
  constructor() {
    this.axios = axios.create({
      baseURL: this.BASE_PATH,
      withCredentials: true,
      headers: this.headers,
    })

    this.axios.interceptors.request.use((config) => {
      const token = Token || localStorage.getItem('userToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  private handleAxiosError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || defaultMessage
      throw new Error(errMsg)
    }
    throw error
  }

  public async fetchSales(): Promise<any> {
    try {
      const response = await this.axios.get('/sales')
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching sales data.')
    }
  }

  public async makeSale(data: Partial<Sale>): Promise<any> {
    try {
      const response = await this.axios.post('/sales', data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while processing sales')
    }
  }

}

export const transService = new TransService()