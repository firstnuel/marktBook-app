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
  Wholesale = 'Wholesale',
  Distribution = 'Distribution',
  ImportExport = 'Import/Export',
  FoodAndBeverage = 'Food&Beverage',
  Other = 'Other',
}

export enum BusinessCategory {
  Electronics = 'Electronics',
  Restaurant = 'Restaurant',
  Fashion = 'Fashion',
  Grocery = 'Grocery',
  Pharmacy = 'Pharmacy',
  Technology = 'Technology',
  Beauty = 'Beauty',
  Auto = 'Automobile',
  Construction = 'Construction',
  Other = 'Other',
}

// Interface for authenticated user payload
export interface AuthPayload {
  userId: string; 
  businessId: string; 
  uId:  {userUId: string, businessUId: string}; 
  email: string; 
  username: string; 
  iat?: number; 
}

// Interface for authentication documents
export interface IAuthDocument extends Document {
  _id: string | ObjectId; 
  uIds?: {userUId: string, businessUId: string}; 
  adminFullName: string; 
  businessName: string; 
  email: string; 
  username: string;
  password: string; 
  createdAt: Date; 
  businessAddress?: string;
  businessType?: BusinessType;
  businessCategory?: BusinessCategory;
  businessLogo?: string;
  passwordResetToken?: string; 
  passwordResetExpires?: number | string; 
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>; 
  resetPassword(password: string): void; 
}

// Interface for registering business data
export interface IRegisterBusinessData {
  _id: ObjectId;
  uIds: {userUId: string, businessUId: string}; 
  email: string; 
  adminFullName: string; 
  username: string;
  password: string; 
  businessName: string;
  businessAddress?: string; 
  businessType: BusinessType; 
  businessCategory: BusinessCategory; 
  businessLogo?: string;
}

// Interface for authentication jobs
export interface IAuthJob {
  value?: string | IAuthDocument;
}

