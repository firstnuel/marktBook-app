/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import { Token } from './authService'
import { IProduct, IStockData } from '@typess/inv'

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

  public async fetchProduct(productId: string): Promise<any> {
    try {
      const response = await this.axios.get(`/products/${productId}`)
      return response.data

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message || 'An error occurred while fetching product.'
        throw new Error(errMsg)
      }
      throw error
    }
  }

  public async updateProduct(productId: string, data: IProduct): Promise<any> {
    try {
      const response = await this.axios.patch(`/products/${productId}`, data)
      return response.data

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message || 'An error occurred while updating product.'
        throw new Error(errMsg)
      }
      throw error
    }
  }

  public async createProduct(data: IProduct): Promise<any> {
    try {
      const response = await this.axios.post('/products', data)
      return response.data

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message || 'An error occurred while creating product.'
        throw new Error(errMsg)
      }
      throw error
    }
  }

  public async addStock(data: IStockData): Promise<any> {
    try {
      const response = await this.axios.post('/stocks', data)
      return response.data

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message || 'An error occurred while adding stock data to product.'
        throw new Error(errMsg)
      }
      throw error
    }
  }
}

export const inventoryService = new InventoryService()