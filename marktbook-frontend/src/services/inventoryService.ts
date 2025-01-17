/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'

let Token: string
export const setToken = (token: string) => {
  Token = token
}

class InventoryService {
  private readonly BASE_PATH: string = import.meta.env.VITE_API_URL
  private readonly axios: AxiosInstance
  private headers = {
    'Accept': 'application/json',
  }

  constructor() {
    this.axios = axios.create({
      baseURL: this.BASE_PATH,
      withCredentials: true,
      headers: this.headers
    })

    this.axios.interceptors.request.use((config) => {
      const token = Token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

  }

  public async fetchProducts(): Promise<any> {
    try {
      const response = await this.axios.get('/products')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message || 'An error occurred while fetching products.'
        throw new Error(errMsg)
      }
      throw error
    }
  }
}

export const inventoryService = new InventoryService()