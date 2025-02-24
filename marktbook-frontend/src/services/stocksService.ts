/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import { Token } from './authService'
import { Location, StockMovement } from '@typess/stocks'

class StocksService {
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

  public async fetchStock(): Promise<any> {
    try {
      const response = await this.axios.get('/stocks')
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching stocks data.')
    }
  }

  public async fetchLocations(): Promise<any> {
    try {
      const response = await this.axios.get('/locations')
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching locations.')
    }
  }

  public async editLocation(id: string, data: Partial<Location>): Promise<any> {
    try {
      const response = await this.axios.patch(`/locations/${id}`, data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while editing location.')
    }
  }

  public async deleteLocation(id: string): Promise<any> {
    try {
      const response = await this.axios.delete(`/locations/${id}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while delete location.')
    }
  }

  public async fetchLowStock(): Promise<any> {
    try {
      const response = await this.axios.get('/stocks/low-stock')
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching low stocks data.')
    }
  }

  public async fetchStocksBySupplier(supplierId: string): Promise<any> {
    try {
      const response = await this.axios.get(`/stocks/suppliers/${supplierId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching stocks by supplier.')
    }
  }

  public async createLocation(data: Partial<Location>): Promise<any> {
    try {
      const response = await this.axios.post('/locations', data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while creating new location.')
    }
  }

  public async newMovement(data: Partial<StockMovement>): Promise<any> {
    try {
      const response = await this.axios.post('/stocks/movements', data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while moving stocks.')
    }
  }

}

export const stocksService = new StocksService()