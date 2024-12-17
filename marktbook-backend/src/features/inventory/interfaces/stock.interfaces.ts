import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

export interface IStockDocument extends Document {
    _id: ObjectId;
    businessId: ObjectId;
    productId: ObjectId;
    locationId?: ObjectId;
    unitsAvailable: number;
    maxQuantity: number;
    minQuantity: number;
    thresholdAlert: boolean;
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
    locationId?: ObjectId;
    productId: ObjectId;
    unitsAvailable: number;
    maxQuantity: number;
    minQuantity: number;
    thresholdAlert: boolean;
    costPerUnit?: number;
    totalValue?: number;
    supplierId?: ObjectId;
    notes?: string;
}

export const ALLOWED_STOCK_FIELDS: (keyof IStockDocument)[] = [
  'unitsAvailable',
  'maxQuantity',
  'minQuantity',
  'thresholdAlert',
  'lastRestocked',
  'costPerUnit',
  'totalValue',
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
