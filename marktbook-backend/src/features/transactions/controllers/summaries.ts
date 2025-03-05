/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISummaryDocument, FilterData } from '@transactions/interfaces/summary.interface'
import { FilterQuery } from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import { config } from '@root/config'
import { saleService } from '@service/db/sale.service'
export const log = config.createLogger('summaryController')

class Summary {

  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!
      const { period } = req.query
      const filterData: FilterQuery<FilterData> = { businessId: user.associatedBusinessesId }
      const lastFilterData: FilterQuery<FilterData> = { businessId: user.associatedBusinessesId }
      
      // Current period filter
      if (!period || period === 'daily') {
        // Current day (last 24 hours)
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0)
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
        
        filterData.createdAt = {
          $gte: startOfDay,
          $lt: endOfDay
        }
        
        // Previous day (24 hours before)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0)
        const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999)
        
        lastFilterData.createdAt = {
          $gte: startOfYesterday,
          $lt: endOfYesterday
        }
      } else if (period === 'monthly') {
        // Current month
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
        
        filterData.createdAt = {
          $gte: startOfMonth,
          $lt: endOfMonth
        }
        
        // Previous month
        const lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
        const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59, 999)
        
        lastFilterData.createdAt = {
          $gte: startOfLastMonth,
          $lt: endOfLastMonth
        }
      } else if (period === 'yearly') {
        // Current year
        const startOfYear = new Date(new Date().getFullYear(), 0, 1)
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999)
        
        filterData.createdAt = {
          $gte: startOfYear,
          $lt: endOfYear
        }
        
        // Previous year
        const lastYear = new Date().getFullYear() - 1
        const startOfLastYear = new Date(lastYear, 0, 1)
        const endOfLastYear = new Date(lastYear, 11, 31, 23, 59, 59, 999)
        
        lastFilterData.createdAt = {
          $gte: startOfLastYear,
          $lt: endOfLastYear
        }
      }

      // Fetch current period data
      const totalSales = await saleService.getTotalSales(filterData)
      const totalProductSales = await saleService.getTotalProductSales(filterData)
      const totalCustomers = await saleService.getTotalCustomers(filterData)
      const netProfit = await saleService.getNetProfit(filterData)
      
      // Fetch previous period data for comparison
      const lastTotalSales = await saleService.getTotalSales(lastFilterData)
      const lastTotalPdSales = await saleService.getTotalProductSales(lastFilterData)
      const lastTotalCustomers = await saleService.getTotalCustomers(lastFilterData)
      const lastNetProfit = await saleService.getNetProfit(lastFilterData)

      // Fetch highest selling products and categories
      const highestSellingProduct = await saleService.getHighestSellingProducts(filterData)
      const higestSellingCategories = await saleService.getHighestSellingCategories(filterData)

      // Construct response document
      const summaryData: ISummaryDocument = {
        totalSales,
        lastTotalSales,
        totalProductSales,
        lastTotalPdSales,
        totalCustomers,
        lastTotalCustomers,
        netProfit,
        lastNetProfit,
        highestSellingProduct,
        higestSellingCategories
      } as ISummaryDocument

      res.status(200).json({ 
        status: 'success',
        message: 'Summary fetched successfully', 
        summaryData })
    } catch(error: any) {
      log.error(`summary attempt failed ${error.message}`)
      next(error)
    }
  }
}

export const summary = new Summary()