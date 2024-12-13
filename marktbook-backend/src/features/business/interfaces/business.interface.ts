
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import { BusinessCategory, BusinessType } from '@auth/interfaces/auth.interface'

export interface IBusinessDocument extends Document {
  _id: string | ObjectId;
  verifiedStatus?: boolean;
  verifyData?: IVerifyBusinessData;
  businessName?: string;
  username: string;
  email: string;
  admins: IBusinessAdmin[];
  businessLogo?: string;
  uId?: string;
  businessCategory?: BusinessCategory;
  businessAddress?: string;
  businessType?: BusinessType;
  businessAccount?: IBusinessBankAccount;
  businessBio?: string;
  notifications?: INotificationSettings;
  social?: ISocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  createdAt?: Date;
}

export interface IBusinessBankAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
  accountType?: string;
}

export interface IVerifyBusinessData {
  owner: string;
  TIN: string;
  CAC: string;
  location: string;
}

export interface INotificationSettings {
  sales: boolean;
  stockLevel: boolean;
  dueCreditSales: boolean;
  userDataChange: boolean;
}

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
}

export enum BusinessRole {
  Owner = 'Owner',
  Manager = 'Manager',
  Staff = 'Staff'
}


export interface IBusinessAdmin {
  userId: string | ObjectId; 
  username: string;
  name: string;
  role: BusinessRole; 
  addedAt?: Date; 
  status: 'active' | 'inactive'; 
}


export interface IBusinessJob {
  value?: string | IBusinessDocument | { admin: IBusinessAdmin, id: string | ObjectId };
}