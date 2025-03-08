import { useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useBusiness } from '@hooks/useBusiness'
import { usePos } from '@hooks/usePos'
import { useContacts } from '@hooks/useContacts'
import { useStocks } from '@hooks/useStocks'
import { useTrans } from '@hooks/useTrans'
import { useDashboard } from '@hooks/useDashboard'


export const useFetchData = () => {
  const { user, fetchUser, userToken } = useAuth()
  const { fetchSales, sales } = useTrans()
  const { business, fetchBusiness, fetchBusinessUsers, users } = useBusiness()
  const { fetchProducts, products, setTaxRate } = usePos()
  const { fetchCustomers, fetchSuppliers, customers, suppliers } = useContacts()
  const { fetchLowStock, fetchStocks, stocks, lowStocks, fetchLocations, locations } = useStocks()
  const {  period, fetchSummary } = useDashboard()

  useEffect(() => {
    if (userToken && !user) fetchUser()
  }, [userToken, user, fetchUser])

  useEffect(() => {
    if (user?.associatedBusinessesId && !business) {
      fetchBusiness(user.associatedBusinessesId)
    }
  }, [user?.associatedBusinessesId, business, fetchBusiness])

  useEffect(() => {
    if (business?._id) fetchSummary(business._id, period)
  }, [business?._id, fetchSummary, period])

  useEffect(() => {
    if (business?._id && !products.length) fetchProducts()
  }, [business?._id, products.length, fetchProducts])

  useEffect(() => {
    if (business?._id && !users.length) fetchBusinessUsers()
  }, [business?._id, fetchBusinessUsers, users.length])

  useEffect(() => {
    if (business?._id && !customers.length) fetchCustomers()
  }, [business?._id, fetchCustomers, customers.length])

  useEffect(() => {
    if (business?._id && !suppliers.length) fetchSuppliers()
  }, [business?._id, fetchSuppliers, suppliers.length])

  useEffect(() => {
    if (business?._id && !sales.length) fetchSales()
  }, [business?._id, fetchSales, sales.length])

  useEffect(() => {
    if (business?.taxRate) setTaxRate(business.taxRate)
  }, [business?.taxRate, setTaxRate])

  useEffect(() => {
    if (business?._id && !stocks.length) fetchStocks()
  }, [business?._id, fetchStocks, stocks.length])

  useEffect(() => {
    if (business?._id && !lowStocks.length) fetchLowStock()
  }, [business?._id, fetchLowStock, lowStocks.length])

  useEffect(() => {
    if (business?._id && !locations.length) fetchLocations()
  }, [business?._id, fetchLocations, locations.length])

}
