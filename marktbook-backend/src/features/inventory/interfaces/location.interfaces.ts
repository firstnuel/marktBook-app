import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'


export interface ILocationDocument extends Document {
    _id: ObjectId;
    stocks: ObjectId[];
    locationName: string;
    businessId:  ObjectId;
    locationType: LocationTypes;
    address: string;
    currentLoad?: number;
    capacity?: number;
    manager: ObjectId;
    locationStatus: Status;
    stockMovements: Array<StockMovement>
}

export enum Status {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
}

export enum LocationTypes {
    WAREHOUSE = 'WAREHOUSE',
    SHOP = 'SHOP',
    STORAGE_UNIT = 'STORAGE_UNIT',
    MOBILE_UNIT = 'MOBILE_UNIT',
    KIOSK = 'KIOSK',
    OFFICE = 'OFFICE',
    DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',
}

export interface StockMovement {
    productId: ObjectId;
    movementType: MovementType;
    quantity: number;
    destination: ObjectId;
    initiatedBy: ObjectId;
    reason: string;
    timestamp: Date;
}

export interface ILocationData {
    locationName: string;
    locationType: LocationTypes;
    address: string;
    capacity?: number;
    manager?: ObjectId;
    currentLoad?: number;
    locationStatus?: Status;
    businessId: string
}

export const EditableFields: (keyof ILocationDocument)[] = [
  'locationName',
  'address',
  'currentLoad',
  'capacity',
  'manager',
  'locationStatus'
]

export const filterLocationFields = (data: Partial<ILocationDocument>,
  filterKeys: (keyof ILocationDocument)[]):  Partial<ILocationDocument> => {
  const filterData:  Partial<ILocationDocument> = {}

  for (const key in data) {
    if (filterKeys.includes(key as keyof ILocationDocument)) {
      filterData[key as keyof ILocationDocument] = data[key as keyof ILocationDocument]
    }
  }
  return filterData
}