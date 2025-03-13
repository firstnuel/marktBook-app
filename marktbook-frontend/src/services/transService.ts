/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import { Sale } from '@typess/trans'
import { QueryPeriod } from '@typess/dashboard'


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

  public async fetchSale(saleId: string): Promise<any> {
    try {
      const response = await this.axios.get(`/sales/${saleId}`)
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

  public async fetchSummary(businessId: string, period: QueryPeriod): Promise<any> {
    try {
      const response = await this.axios.get(`/sales/summary/${businessId}`, { params: { period } })
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching summary data.')
    }
  }

  public async updateSale(saleId: string, data: { status: string, businessId: string }): Promise<any> {
    try {
      const response = await this.axios.patch(`/sales/${saleId}`, data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while updating sale.')
    }
  }

  public async cancelSale(saleId: string, data: { reason: string, businessId: string }): Promise<any> {
    try {
      const response = await this.axios.patch(`/sales/${saleId}/cancel`, data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while cancelling sale.')
    }
  }

}

export const transService = new TransService()