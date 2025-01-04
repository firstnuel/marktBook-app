import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'


export interface ICustomerDocument extends Document {
    _id: ObjectId;
    businessId: ObjectId;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    customerType: 'Individual' | 'Business';
    businessName?: string
    createdAt?: Date;
    updatedAt?: Date;
    marketingOptIn?: boolean;
}

