import { IBusinessDocument } from '@business/interfaces/business.interface'
import { BusinessModel } from '@business/models/business.schema'


class BusinessService {
    public async addBusinessData(data: IBusinessDocument): Promise<void> {
        await BusinessModel.create(data)
      }

}


export const businessService: BusinessService = new BusinessService()