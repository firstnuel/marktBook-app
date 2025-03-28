import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import { LocationTypes, Status} from '@inventory/interfaces/location.interfaces'


export interface IStockDocument extends Document {
    _id: ObjectId;
    businessId: ObjectId;
    productId: ObjectId;
    locationId?: ObjectId;
    unitsAvailable: number;
    maxQuantity: number;
    minQuantity: number;
    thresholdAlert: boolean;
    compartment: string;
    lastRestocked: Date;
    costPerUnit?: number;
    totalValue?: number;
    supplierId?: ObjectId;
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: ObjectId;
    updatedBy?: ObjectId;
}


export interface IStockData {
    businessId: ObjectId;
    productId: ObjectId;
    unitsAvailable: number;
    maxQuantity: number;
    minQuantity: number;
    thresholdAlert: boolean;
    costPerUnit?: number;
    totalValue?: number;
    supplierId?: ObjectId;
    compartment?: string;
    notes?: string;
    //location Data
    locationName: string;
    locationId?: string;
    locationType: LocationTypes;
    address: string;
    locationStatus: Status;
    capacity?: number;
}



export const ALLOWED_STOCK_FIELDS: (keyof IStockDocument)[] = [
  'unitsAvailable',
  'maxQuantity',
  'minQuantity',
  'thresholdAlert',
  'lastRestocked',
  'costPerUnit',
  'totalValue',
  'compartment',
  'notes'
]

export function filterStockFields(
  data: Partial<IStockDocument>,
  filterKeys: (keyof IStockDocument)[]
): Partial<IStockDocument> {
  const filteredData: Partial<IStockDocument> = {}

  for (const key in data) {
    if (filterKeys.includes(key as keyof IStockDocument)) {
      filteredData[key as keyof IStockDocument] = data[key as keyof IStockDocument]
    }
  }

  return filteredData
}
