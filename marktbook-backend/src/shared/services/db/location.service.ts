import { ILocationDocument } from '@inventory/interfaces/location.interfaces'
import { LocationModel } from '@inventory/models/locations.schema'


class LocationService {
  public async addLocation(data: ILocationDocument): Promise<void> {
    await LocationModel.create(data)
  }

}

export const locationService = new LocationService()