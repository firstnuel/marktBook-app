import {
  clearError,
  fetchCustomers,
  fetchCustomer,
  fetchSuppliers,
  fetchSupplier,
  updateCustomer,
  updateSupplier,
  deleteCustomer,
  createCustomer,
  createSupplier,
  deleteSupplier,
  setMainOpt,
  setSubOpt,
  rmContacts
} from '@reducers/contactsReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useCallback } from 'react'
import { Customer, Supplier } from '@typess/contacts'

export const useContacts = () => {
  const {
    mainOpt,
    subOpt,
    loading,
    success,
    error,
    supplier,
    customer,
    suppliers,
    customers
  } = useAppSelector(state => state.contacts)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [error, dispatch, success])

  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])

  const rmContactsHandler = useCallback(() => dispatch(rmContacts()), [dispatch])

  const setMainOption = useCallback((option: string) => dispatch(setMainOpt({ option })), [dispatch])

  const setSubOption = useCallback((option: string) => dispatch(setSubOpt({ option })), [dispatch])

  const fetchCustomersHandler = useCallback(() => dispatch(fetchCustomers()), [dispatch])

  const fetchCustomerHandler = useCallback((customerId: string) => dispatch(fetchCustomer(customerId)), [dispatch])

  const fetchSuppliersHandler = useCallback(() => dispatch(fetchSuppliers()), [dispatch])

  const createCustomerHandler = useCallback((data: Partial<Customer>) => dispatch(createCustomer(data)), [dispatch])

  const createSupplierHandler = useCallback((data: Partial<Supplier>) => dispatch(createSupplier(data)), [dispatch])

  const fetchSupplierHandler = useCallback((supplierId: string) => dispatch(fetchSupplier(supplierId)), [dispatch])

  const updateCustomerHandler = useCallback((customerId: string, data: Partial<Customer>) =>
    dispatch(updateCustomer({ customerId, data })), [dispatch])

  const updateSupplierHandler = useCallback((supplierId: string, data: Partial<Supplier>) =>
    dispatch(updateSupplier({ supplierId, data })), [dispatch])

  const deleteCustomerHandler = useCallback((customerId: string) => dispatch(deleteCustomer(customerId)), [dispatch])

  const deleteSupplierHandler = useCallback((supplierId: string) => dispatch(deleteSupplier(supplierId)), [dispatch])

  return {
    // State
    mainOpt,
    subOpt,
    loading,
    success,
    error,
    supplier,
    customer,
    suppliers,
    customers,
    // Actions
    clearError: clearErrorHandler,
    rmContacts: rmContactsHandler,
    setMainOpt: setMainOption,
    setSubOpt: setSubOption,
    createCustomer: createCustomerHandler,
    createSupplier: createSupplierHandler,
    fetchCustomers: fetchCustomersHandler,
    fetchCustomer: fetchCustomerHandler,
    fetchSuppliers: fetchSuppliersHandler,
    fetchSupplier: fetchSupplierHandler,
    updateCustomer: updateCustomerHandler,
    updateSupplier: updateSupplierHandler,
    deleteCustomer: deleteCustomerHandler,
    deleteSupplier: deleteSupplierHandler
  }
}