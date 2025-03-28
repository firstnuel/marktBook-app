import { ISaleDocument } from '@transactions/interfaces/sales.interface'
import { SaleModel } from '@transactions/models/sales.schema'
import { ObjectId } from 'mongodb'
import { FilterQuery } from 'mongoose'
import { FilterData } from '@transactions/interfaces/summary.interface'
import { IProductDocument, ProductCategory } from '@inventory/interfaces/products.interface'
import { ProductModel } from '@inventory/models/products.schema'

class SaleService {
  // Create a new sale
  public async newSale(saleData: ISaleDocument): Promise<ISaleDocument | null> {
    const sale = await SaleModel.create(saleData)
    return await SaleModel.findOne({ _id: sale._id })
      .populate('customer', ['name', 'businessName', 'address'])
      .populate('initiatedBy', 'name')
      .populate('completedBy', 'name')
      .exec()
  }

  // Fetch all sales for a business
  public async getAll(businessId: ObjectId): Promise<ISaleDocument[]> {
    return await SaleModel.find({ businessId }).sort({ createdAt: -1 })
      .populate('customer', ['name', 'businessName',  'address'])
      .populate('initiatedBy', 'name')
      .populate('completedBy', 'name')
      .exec()
  }

  // Get a single sale by ID
  public async getById(saleIdOrRef: string, businessId: ObjectId): Promise<ISaleDocument | null> {
    const query = saleIdOrRef.includes('-') ? { invRef: saleIdOrRef, businessId } : { _id: saleIdOrRef, businessId }
    return await SaleModel.findOne(query)
      .populate('customer', ['name', 'businessName', 'address'])
      .populate('initiatedBy', 'name')
      .populate('completedBy', 'name')
      .exec()
  }

  public async updateStatus(saleId: ObjectId, businessId: ObjectId, updateData: Partial<ISaleDocument>): 
  Promise<ISaleDocument | null> {
    return await SaleModel.findOneAndUpdate(
      { _id: saleId,  businessId },
      { $set: updateData }, 
      { new: true } 
    )  
      .populate('customer', ['name', 'businessName', 'address'])
      .populate('initiatedBy', 'name')
      .populate('completedBy', 'name')
      .exec()
  }

  // Process a refund for a sale
  public async refund(saleId: string): Promise<ISaleDocument | null> {
    return await SaleModel.findByIdAndUpdate(
      saleId,
      { refundStatus: 'REFUNDED', status: 'REFUNDED' },
      { new: true }
    ).exec()
  }

  // Fetch sales by customer ID
  public async getByCustomer(customerId: string): Promise<ISaleDocument[]> {
    return await SaleModel.find({ customerId: new ObjectId(customerId) }).sort({ createdAt: -1 }).exec()
  }

  // Summary methods with detailed data for charts
  // Get total sales amount with timeline data for charts
  public async getTotalSales(filter: FilterQuery<FilterData>): Promise<number[]> {
  // First get the total for the summary
    const totalResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { status: { $ne: 'REFUNDED' } } },
      { 
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalPrice' }
        }
      }
    ]).exec()
  
    // Then get the time-series data for charts
    const timelineResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { status: { $ne: 'REFUNDED' } } },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
          },
          dailyTotal: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          amount: '$dailyTotal'
        }
      }
    ]).exec()

    // Extract just the daily amounts in the same order as the timeline
    const dailyAmounts = timelineResult.map(item => item.amount)

    return totalResult.length > 0 
      ? [totalResult[0].totalAmount, ...dailyAmounts]
      : [0]
  }

  // Get total product sales with product breakdown
  public async getTotalProductSales(filter: FilterQuery<FilterData>): Promise<number[]> {
    const totalResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { status: { $ne: 'REFUNDED' } } },
      { $unwind: '$saleItems' },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$saleItems.quantity' }
        }
      }
    ]).exec()
  
    const productResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { status: { $ne: 'REFUNDED' } } },
      { $unwind: '$saleItems' },
      {
        $group: {
          _id: '$saleItems.productName',
          quantity: { $sum: '$saleItems.quantity' },
          revenue: { $sum: { $multiply: ['$saleItems.unitSalePrice', '$saleItems.quantity'] } }
        }
      },
      { $sort: { quantity: -1 } },
      {
        $project: {
          _id: 0,
          product: '$_id',
          quantity: 1,
          revenue: 1
        }
      }
    ]).exec()

    const dailyTrendResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { status: { $ne: 'REFUNDED' } } },
      { $unwind: '$saleItems' },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          dailyQuantity: { $sum: '$saleItems.quantity' }
        }
      },
      { $sort: { '_id.date': 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          quantity: '$dailyQuantity'
        }
      }
    ]).exec()

    // Extract just the product quantities and daily quantities in order
    const productQuantities = productResult.map(item => item.quantity)
    const dailyQuantities = dailyTrendResult.map(item => item.quantity)

    return totalResult.length > 0 
      ? [totalResult[0].totalQuantity, ...productQuantities, ...dailyQuantities] 
      : [0]
  }

  // Get total customers with daily new customer trend
  public async getTotalCustomers(filter: FilterQuery<FilterData>): Promise<number[]> {
    const totalResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { customer: { $exists: true } } },
      {
        $group: { _id: '$customer' }
      },
      {
        $group: { _id: null, count: { $sum: 1 } }
      }
    ]).exec()
  
    const dailyCustomersResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { customer: { $exists: true } } },
      {
        $group: {
          _id: {
            customer: '$customer',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: '$newCustomers'
        }
      }
    ]).exec()

    // Extract just the daily customer counts in order
    const dailyCounts = dailyCustomersResult.map(item => item.count)

    return totalResult.length > 0 
      ? [totalResult[0].count, ...dailyCounts]
      : [0]
  }

  // Calculate net profit with daily trend
  public async getNetProfit(filter: FilterQuery<FilterData>): Promise<number[]> {
    const totalResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { status: { $ne: 'REFUNDED' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalTax: { $sum: '$taxAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          netProfit: { $subtract: ['$totalRevenue', '$totalTax'] }
        }
      }
    ]).exec()
  
    const dailyProfitResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { status: { $ne: 'REFUNDED' } } },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          dailyProfit: { $sum: { $subtract: ['$totalPrice', '$taxAmount'] } }
        }
      },
      { $sort: { '_id.date': 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          profit: '$dailyProfit'
        }
      }
    ]).exec()

    // Extract just the daily profit amounts in order
    const dailyProfits = dailyProfitResult.map(item => item.profit)

    return totalResult.length > 0 
      ? [totalResult[0].netProfit, ...dailyProfits]
      : [0]
  }
  // NEW METHODS FOR HIGHEST SELLING PRODUCTS AND CATEGORIES

  // Get highest selling products
  public async getHighestSellingProducts(filter: FilterQuery<FilterData>): Promise<{ product: IProductDocument, amountSold: number }[]> {
    const productSalesResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { status: { $ne: 'REFUNDED' } } },
      { $unwind: '$saleItems' },
      {
        $group: {
          _id: '$saleItems.productId',
          productName: { $first: '$saleItems.productName' }, // For reference
          productSKU: { $first: '$saleItems.productSKU' }, // For reference
          totalQuantity: { $sum: '$saleItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$saleItems.unitSalePrice', '$saleItems.quantity'] } }
        }
      },
      { $sort: { totalQuantity: -1 } }, // Sort by quantity sold, highest first
      { $limit: 10 } // Get top 10 products
    ]).exec()

    // If we have results, fetch the full product details
    if (productSalesResult.length > 0) {
      const productIds = productSalesResult.map(item => item._id)
      const products = await ProductModel.find({ _id: { $in: productIds } }).exec()

      // Map product details to sales data
      return productSalesResult.map(salesItem => {
        const productDetails = products.find(p => p._id.toString() === salesItem._id.toString()) || null
        return {
          product: productDetails as IProductDocument,
          amountSold: salesItem.totalQuantity
        }
      }).filter(item => item.product !== null) // Filter out any null products
    }

    return []
  }

  // Get highest selling categories
  public async getHighestSellingCategories(filter: FilterQuery<FilterData>): Promise<{ category: ProductCategory, amountOfSales: number }[]> {
    // First, we need to get the product IDs from sales
    const productSalesResult = await SaleModel.aggregate([
      { $match: filter },
      { $match: { status: { $ne: 'REFUNDED' } } },
      { $unwind: '$saleItems' },
      {
        $group: {
          _id: '$saleItems.productId',
          totalQuantity: { $sum: '$saleItems.quantity' }
        }
      }
    ]).exec()

    if (productSalesResult.length > 0) {
      // Get all product IDs from sales
      const productIds = productSalesResult.map(item => item._id)
      
      // Fetch the products to get their categories
      const products = await ProductModel.find({ _id: { $in: productIds } }).exec()
      
      // Map products to their sales quantities
      const productSalesMap = new Map<string, number>()
      productSalesResult.forEach(item => {
        productSalesMap.set(item._id.toString(), item.totalQuantity)
      })
      
      // Group by category
      const categorySales = new Map<ProductCategory, number>()
      products.forEach(product => {
        const category = (product as IProductDocument).productCategory
        const salesQuantity = productSalesMap.get(product._id.toString()) || 0
        
        if (category) {
          const currentTotal = categorySales.get(category) || 0
          categorySales.set(category, currentTotal + salesQuantity)
        }
      })
      
      // Convert map to array and sort
      const result = Array.from(categorySales.entries()).map(([category, amountOfSales]) => ({
        category,
        amountOfSales
      }))
      
      return result.sort((a, b) => b.amountOfSales - a.amountOfSales)
    }
    
    return []
  }
}

export const saleService = new SaleService()