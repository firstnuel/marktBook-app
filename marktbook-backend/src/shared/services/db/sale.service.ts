/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISaleDocument } from '@transactions/interfaces/sales.interface'
import { SaleModel } from '@transactions/models/sales.schema'
import { ObjectId } from 'mongodb'

class SaleService {
  // Create a new sale
  public async newSale(saleData: ISaleDocument): Promise<ISaleDocument> {
    return await SaleModel.create(saleData)
  }

  // Fetch all sales for a business
  public async getAll(businessId: ObjectId): Promise<ISaleDocument[]> {
    return await SaleModel.find({ businessId }).sort({ createdAt: -1 }).exec()
  }

  // Get a single sale by ID
  public async getById(saleId: ObjectId, businessId: ObjectId): Promise<ISaleDocument | null> {
    return await SaleModel.findOne({ _id: saleId, businessId }).exec()
  }

  public async updateStatus( saleId: ObjectId, businessId: ObjectId, updateData: Partial<ISaleDocument>): 
  Promise<ISaleDocument | null> {
    return await SaleModel.findOneAndUpdate(
      { _id: saleId,  businessId },
      { $set: updateData }, 
      { new: true } 
    )
  }

  // Delete a sale by ID
  public async delete(saleId: string): Promise<void> {
    await SaleModel.findByIdAndDelete(saleId).exec()
  }

  // Process a refund for a sale
  public async refund(saleId: string): Promise<ISaleDocument | null> {
    return await SaleModel.findByIdAndUpdate(
      saleId,
      { refundStatus: 'REFUNDED', status: 'REFUNDED' },
      { new: true }
    ).exec()
  }

  // Get sales summary (e.g., total sales, revenue)
  public async getSummary(businessId: ObjectId, filters: any): Promise<any> {
    const match: any = { businessId }
    if (filters.startDate && filters.endDate) {
      match.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      }
    }

    return await SaleModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]).exec()
  }

  // Search sales based on criteria
  public async search(query: any): Promise<ISaleDocument[]> {
    const searchQuery: any = {}
    if (query.customerName) searchQuery.customerName = { $regex: query.customerName, $options: 'i' }
    if (query.startDate && query.endDate) {
      searchQuery.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      }
    }
    return await SaleModel.find(searchQuery).sort({ createdAt: -1 }).exec()
  }

  // Export sales data
  public async export(query: any): Promise<ISaleDocument[]> {
    const exportQuery: any = {}
    if (query.startDate && query.endDate) {
      exportQuery.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      }
    }
    return await SaleModel.find(exportQuery).exec()
  }

  // Adjust a sale record
  public async adjust(saleId: string, adjustments: Partial<ISaleDocument>): Promise<ISaleDocument | null> {
    return await SaleModel.findByIdAndUpdate(saleId, adjustments, { new: true }).exec()
  }

  // Fetch sales by customer ID
  public async getByCustomer(customerId: string): Promise<ISaleDocument[]> {
    return await SaleModel.find({ customerId: new ObjectId(customerId) }).sort({ createdAt: -1 }).exec()
  }
}

export const saleService = new SaleService()
