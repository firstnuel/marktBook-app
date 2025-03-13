/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import { Customer, Supplier } from '@typess/contacts'


class ContactsService {
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

  public async fetchCustomer(customerId: string): Promise<any> {
    try {
      const response = await this.axios.get(`/customers/${customerId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching customer.')
    }
  }

  public async fetchSupplier(supplierId: string): Promise<any> {
    try {
      const response = await this.axios.get(`/suppliers/${supplierId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching supplier.')
    }
  }

  public async fetchCustomers(): Promise<any> {
    try {
      const response = await this.axios.get('/customers')
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching business customers.')
    }
  }

  public async fetchSuppliers(): Promise<any> {
    try {
      const response = await this.axios.get('/suppliers')
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while fetching business suppliers.')
    }
  }

  public async updateCustomers(customerId: string, data: Partial<Customer>): Promise<any> {
    try {
      const response = await this.axios.patch(`/customers/${customerId}`, data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while updating customer data.')
    }
  }

  public async updateSupplier(supplierId: string, data: Partial<Supplier>): Promise<any> {
    try {
      const response = await this.axios.patch(`/suppliers/${supplierId}`, data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while updating supplier data.')
    }
  }

  public async createCustomer(data: Partial<Customer>): Promise<any> {
    try {
      const response = await this.axios.post('/customers', data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while creating customer.')
    }
  }

  public async createSupplier(data: Partial<Supplier>): Promise<any> {
    try {
      const response = await this.axios.post('/suppliers', data)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while creating supplier.')
    }
  }

  public async deleteCustomer(customerId: string): Promise<any> {
    try {
      const response = await this.axios.delete(`/customers/${customerId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while deleting customer.')
    }
  }

  public async deleteSupplier(supplierId: string): Promise<any> {
    try {
      const response = await this.axios.delete(`/suppliers/${supplierId}`)
      return response.data
    } catch (error) {
      this.handleAxiosError(error, 'An error occurred while deleting supplier.')
    }
  }

}


export const contactsService = new ContactsService()