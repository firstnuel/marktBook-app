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

export enum SuppierType {
    Manufacturer = 'Manufacturer',
    Distributor = 'Distributor',
    Retailer = 'Retailer',
    Wholesaler ='Wholesaler'
}

export enum PaymentMethod {
    Bank_Transfer = 'Bank Transfer',
    Cash = 'Cash',
    Credit_Card = 'Credit Card',
    Cheque = 'Cheque'
}

export interface ISupplierDocument extends Document {
    _id: ObjectId;
    businessId: ObjectId;
    name: string;
    contactPerson: string;
    supplierType: SuppierType,
    email?: string;
    phone?: string;
    address?: string;
    companyName?: string;
    preferredPaymentMethod? : PaymentMethod;
    createdAt?: Date;
    updatedAt?: Date;
}