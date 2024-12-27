import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'


export interface ILogDocument extends Document {
    _id: ObjectId; 
    userId: ObjectId;
    businessId: ObjectId;
    username: string;
    action: ActionType;
    entity: EntityType;
    entityId: ObjectId;
    description: string;
    timestamp: Date;
}

// Enum for user actions that trigger an activity log
export enum ActionType {
    EDIT = 'EDIT',
    CREATE = 'CREATE',
    DELETE = 'DELETE',
    SALE = 'SALE',
    MOVE = 'MOVE',
    UPDATE = 'UPDATE',
    REFUND = 'REFUND'
}

// Enum for entity types that can be affected by actions
export enum EntityType {
    PRODUCT = 'PRODUCT',
    SALE = 'SALE',
    STOCK = 'STOCK',
    LOCATION = 'LOCATION',
    TRANSACTION = 'TRANSACTION',
    USER = 'USER',
    BUSINESS = 'BUSINESS',
    AUTH = 'AUTH',
    SUPPLIER  = 'SUPPLIER',
    CUSTOMER = 'CUSTOMER'
}


export const createActivityLog = (
  userId: string | ObjectId,
  username: string,
  businessId: string | ObjectId,
  action: ActionType,
  entity: EntityType,
  entityId: string | ObjectId,
  description: string
): ILogDocument => ({
  _id: new ObjectId(),
  userId: new ObjectId(userId),
  businessId: new ObjectId(businessId),
  username,
  action,
  entity,
  entityId: new ObjectId(entityId),
  description,
  timestamp: new Date()
} as ILogDocument )