import { IBusinessDocument } from '@business/interfaces/business.interface'
import { BusinessModel } from '@business/models/business.schema'
import { ObjectId } from 'mongoose'


class BusinessService {
    public async addBusinessData(data: IBusinessDocument): Promise<void> {
        await BusinessModel.create(data)
    }

    public async getBusinessById(id: string | ObjectId): Promise<IBusinessDocument | null> {
      const result = await BusinessModel.findById(id)
      return result
    }
}


export const businessService: BusinessService = new BusinessService()