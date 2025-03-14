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
      
      const today = new Date()

      if (!period || period === 'daily') {
        // Current and previous day filter
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

        filterData.createdAt = { $gte: startOfDay, $lt: endOfDay }

        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0)
        const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)

        lastFilterData.createdAt = { $gte: startOfYesterday, $lt: endOfYesterday }
      } else if (period === 'weekly') {
        // Start of current week (Monday)
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + 1)
        startOfWeek.setHours(0, 0, 0, 0)

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)

        filterData.createdAt = { $gte: startOfWeek, $lt: endOfWeek }

        // Start of previous week (Monday)
        const startOfLastWeek = new Date(startOfWeek)
        startOfLastWeek.setDate(startOfWeek.getDate() - 7)

        const endOfLastWeek = new Date(endOfWeek)
        endOfLastWeek.setDate(endOfWeek.getDate() - 7)

        lastFilterData.createdAt = { $gte: startOfLastWeek, $lt: endOfLastWeek }
      } else if (period === 'monthly') {
        // Current and previous month filter
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)

        filterData.createdAt = { $gte: startOfMonth, $lt: endOfMonth }

        const lastMonth = new Date(today)
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
        const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59)

        lastFilterData.createdAt = { $gte: startOfLastMonth, $lt: endOfLastMonth }
      } else if (period === 'yearly') {
        // Current and previous year filter
        const startOfYear = new Date(today.getFullYear(), 0, 1)
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59)

        filterData.createdAt = { $gte: startOfYear, $lt: endOfYear }

        const lastYear = today.getFullYear() - 1
        const startOfLastYear = new Date(lastYear, 0, 1)
        const endOfLastYear = new Date(lastYear, 11, 31, 23, 59, 59)

        lastFilterData.createdAt = { $gte: startOfLastYear, $lt: endOfLastYear }
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
