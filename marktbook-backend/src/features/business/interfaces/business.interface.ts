import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import { BusinessCategory, BusinessType } from '@auth/interfaces/auth.interface'
import { Currency } from '@inventory/interfaces/products.interface'

export interface IBusinessDocument extends Document {
  _id: string | ObjectId;
  verifiedStatus?: boolean;
  verifyData?: IVerifyBusinessData;
  businessName?: string;
  username: string;
  email: string;
  admins: IBusinessAdmin[];
  currency: Currency;
  customCategories?: string[];
  businessLogo?: string;
  businessImg?: string;
  taxRate?: number;
  uId?: string;
  businessCategory?: BusinessCategory;
  businessAddress?: string;
  businessType?: BusinessType;
  businessAccount?: IBusinessBankAccount;
  phoneNumber?: string;
  notifications?: INotificationSettings;
  createdAt?: Date;
}

export const EDIT_BUSINESS_FIELDS: (keyof IBusinessDocument)[] = [
  'businessLogo',
  'businessAddress',
  'businessAccount',
  'notifications',
  'customCategories',
  'currency',
  'taxRate',
  'businessCategory',
  'businessType',
  'phoneNumber',
  'businessName',
] 

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

export enum BusinessRole {
  Owner = 'Owner',
  Manager = 'Manager',
  Staff = 'Staff'
}


export interface IBusinessAdmin {
  userId: string | ObjectId; 
  username: string;
}


export interface IBusinessJob {
  value?: string | IBusinessDocument | { admin: IBusinessAdmin, id: string | ObjectId };
}



export function filterFields<T>(
  data: Partial<T>,
  filterKeys: (keyof T)[]
): Partial<T> {
  const filteredData: Partial<T> = {}

  for (const key in data) {
    if (filterKeys.includes(key as keyof T)) {
      filteredData[key as keyof T] = data[key as keyof T]
    }
  }

  return filteredData
}