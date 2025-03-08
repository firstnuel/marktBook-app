import { LogModel } from '@activity/models/logs.schema'
import { IBusinessDocument, IBusinessAdmin } from '@business/interfaces/business.interface'
import { BusinessModel } from '@business/models/business.schema'
import { CustomerModel } from '@contacts/models/customer.schema'
import { LocationModel } from '@inventory/models/locations.schema'
import { ProductModel } from '@inventory/models/products.schema'
import { StockModel } from '@inventory/models/stocks.schema'
import { SaleModel } from '@transactions/models/sales.schema'
import { ObjectId } from 'mongodb'
import { Model } from 'mongoose'

class BusinessService {
  public async addBusinessData(data: IBusinessDocument): Promise<void> {
    await BusinessModel.create(data)
  }

  public async updateBusinessData(id: string | ObjectId, data: Partial<IBusinessDocument>): Promise<IBusinessDocument | null> {
    const result = await BusinessModel.findByIdAndUpdate(id, { ...data }, { new: true }).exec()
    return result
  }

  public async getBusinessById(id: string | ObjectId): Promise<IBusinessDocument | null> {
    const result = await BusinessModel.findById(new ObjectId(id)).exec()
    return result
  }

  public async getBusinessByEmail(email: string): Promise<IBusinessDocument | null> {
    const result = await BusinessModel.findOne({ email }).exec()
    return result
  }

  public async addBusinessAdmin(userData: IBusinessAdmin, businessId: string): Promise<void> {
    await BusinessModel.findByIdAndUpdate(new ObjectId(businessId), {
      $push: { 
        admins: { ...userData, addedAt: Date.now() } 
      }
    }
    ).exec()
  }

  public async deleteBusiness(businessId: ObjectId | string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collections: Array<Model<any>> = [ProductModel, LocationModel, CustomerModel, SaleModel, StockModel, LogModel]

    for (const model of collections) {
      await model.deleteMany({ businessId })
    }
    await BusinessModel.findByIdAndDelete(businessId)
  }
}


export const businessService: BusinessService = new BusinessService()