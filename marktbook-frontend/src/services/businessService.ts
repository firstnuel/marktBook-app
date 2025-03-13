/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import { Business } from '@typess/bizness'
import { User } from '@typess/auth'

class BusinessService {
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

  public async fetchBusiness(businessId: string): Promise<any> {
    try {
      const response = await this.axios.get(`/business/${businessId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching business data.')
    }
  }

  public async fetchUsers(): Promise<any> {
    try {
      const response = await this.axios.get('/users')
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching business users.')
    }
  }

  public async fetchUser(id: string): Promise<any> {
    try {
      const response = await this.axios.get(`/users/${id}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching user.')
    }
  }

  public async deleteUser(id: string): Promise<any> {
    try {
      const response = await this.axios.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while deleting user.')
    }
  }

  public async updateBusiness(businessId: string, data: Partial<Business>): Promise<any> {
    try {
      const response = await this.axios.patch(`/business/${businessId}`, data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while updating business data.')
    }
  }

  public async deleteBusiness(businessId: string): Promise<any> {
    try {
      const response = await this.axios.delete(`/business/${businessId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while deleting business data.')
    }
  }

  public async updateUser(userId: string, data: Partial<User>): Promise<any> {
    try {
      const response = await this.axios.patch(`/users/${userId}`, data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while updating user account.')
    }
  }

  public async createUser(data: Partial<User>): Promise<any> {
    try {
      const response = await this.axios.post('/users', data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while creating user.')
    }
  }
}

export const businessService = new BusinessService()