import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'


export interface ILocationDocument extends Document {
    _id: ObjectId;
    stockId: ObjectId;
    locationName: string;
    locationType: LocationTypes;
    address: string;
    compartment: string;
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
    name: string;
    type: LocationTypes;
    address: string;
    compartment: string;
    capacity?: number;
    status: Status;
}