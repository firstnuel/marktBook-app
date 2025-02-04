/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import { Token } from './authService'
import { EditStockData, IProduct, IStockData } from '@typess/inv'

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
      headers: this.headers,
    })

    this.axios.interceptors.request.use((config) => {
      const token = Token
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

  public async fetchProducts(): Promise<any> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const response = await this.axios.get('/products')
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching products.')
    }
  }

  public async fetchProduct(productId: string): Promise<any> {
    try {
      const response = await this.axios.get(`/products/${productId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching product.')
    }
  }

  public async fetchStock(productId: string): Promise<any> {
    try {
      const response = await this.axios.get(`/stocks/${productId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching stock data.')
    }
  }

  public async fetchProductsByCat(category: string): Promise<any> {
    try {
      const response = await this.axios.get(`/products/categories/${category}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, `An error occurred while products by ${category}.`)
    }
  }

  public async updateProduct(productId: string, data: IProduct): Promise<any> {

    try {
      const response = await this.axios.patch(`/products/${productId}`, data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while updating product.')
    }
  }

  public async updateStock(productId: string, data: EditStockData): Promise<any> {

    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      const response = await this.axios.patch(`/stocks/${productId}`, data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while updating stock data.')
    }
  }

  public async deleteProduct(productId: string): Promise<any> {
    try {
      const response = await this.axios.delete(`/products/${productId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while deleting product.')
    }
  }

  public async createProduct(data: IProduct): Promise<any> {
    try {
      const response = await this.axios.post('/products', data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while creating product.')
    }
  }

  public async addStock(data: IStockData): Promise<any> {
    try {
      const response = await this.axios.post('/stocks', data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while adding stock data to product.')
    }
  }
}

export const inventoryService = new InventoryService()
