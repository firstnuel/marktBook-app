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

export interface AuthPayload {
    userId: string;
    businessId: string;
    uId: string;
    email: string;
    username: string;
    iat?: number;
}

export interface IAuthDocument extends Document {
    _id: string | ObjectId;
    uId: string;
    username: string;
    businessId: string;
    email: string;
    password?: string;
    createdAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: number | string;
    comparePassword(password: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
  }

  export interface IRegisterBusinessData {
    _id: ObjectId;
    uId: string;
    email: string;
    adminFullName: string;
    username: string;
    password: string;
    businessname: string;
    businessAddress?: string;
    businessType: BusinessType;
    businessCategory: string;
    businessLogo?: string; 
  }

  export interface IAuthJob {
    value?: string | IAuthDocument;
  }