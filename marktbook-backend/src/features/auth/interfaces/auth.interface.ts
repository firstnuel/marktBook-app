import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload; 
    }
  }
}

export enum BusinessType {
  Retail = 'Retail',
  Service = 'Service',
  Manufacturing = 'Manufacturing',
}

export enum BusinessCategory {
  Electronics = 'Electronics',
  Restaurant = 'Restaurant',
  Fashion = 'Fashion',
  Grocery = 'Grocery',
  Pharmacy = 'Pharmacy',
  Technology = 'Technology',
  Entertainment = 'Entertainment',
  Beauty = 'Beauty',
  Auto = 'Automobile',
  Construction = 'Construction',
  Other = 'Other',
}

// Interface for authenticated user payload
export interface AuthPayload {
  userId: string; 
  businessId: string; 
  uId: string; 
  email: string; 
  username: string; 
  iat?: number; 
}

// Interface for authentication documents
export interface IAuthDocument extends Document {
  _id: string | ObjectId; 
  uId: string; 
  username: string; 
  businessId: string; 
  businessName: string; 
  email: string; 
  password?: string; 
  createdAt: Date; 
  passwordResetToken?: string; 
  passwordResetExpires?: number | string; 
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>; 
}

// Interface for registering business data
export interface IRegisterBusinessData {
  _id: ObjectId;
  uId: string; 
  email: string; 
  // adminFullName: string; 
  username: string;
  password: string; 
  businessName: string;
  // businessAddress?: string; 
  // businessType: BusinessType; 
  // businessCategory: BusinessCategory; 
  businessLogo?: string;
}

// Interface for authentication jobs
export interface IAuthJob {
  value?: string | IAuthDocument; 
}

