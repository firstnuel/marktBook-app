import { ILocationDocument } from '@inventory/interfaces/location.interfaces'
import { LocationModel } from '@inventory/models/locations.schema'
import { ObjectId } from 'mongodb'


class LocationService {
  public async addLocation(data: ILocationDocument): Promise<void> {
    await LocationModel.create(data)
  }

  public async deleteLocation( stockId: ObjectId): Promise<void> {
    await LocationModel.deleteOne({ stockId }).exec()
  }

  public async findByName(name: string, businessId: ObjectId): Promise<ILocationDocument | null> {
    const result = LocationModel.findOne({ locationName: name, businessId })
    return result
  }

  public async getById(Id: ObjectId): Promise<ILocationDocument | null> {
    const result = await LocationModel.findById(Id).exec()
    return result
  }

  public async fetchAll(businessId: ObjectId): Promise<ILocationDocument[] | []> {
    const result = await LocationModel.find({ businessId })
      .populate({
        path: 'stockMovements.productId', 
        select: 'productName'
      })
      .populate('manager', 'name')
      .exec()

    return result
  }

  public async editLocation(Id: ObjectId, data: Partial<ILocationDocument>): Promise<ILocationDocument | null> {
    return LocationModel.findByIdAndUpdate(Id, data, { new: true })
  }

}

export const locationService = new LocationService()