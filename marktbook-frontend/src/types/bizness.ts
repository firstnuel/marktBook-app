import { BusinessCategory, BusinessType } from './auth'
import { Currency } from './pos'

export interface BusinessState {
    business: Business | null
    error: string | null,
    success: string | null,
    loading: boolean
}

export interface Business  {
    _id: string ;
    verifiedStatus?: boolean;
    verifyData?: IVerifyBusinessData;
    businessName?: string;
    username: string;
    email: string;
    admins: IBusinessAdmin[];
    currency?: Currency;
    customCategories?: string[];
    businessLogo?: string;
    businessImg?: string;
    uId?: string;
    businessCategory?: BusinessCategory;
    businessAddress?: string;
    businessType?: BusinessType;
    businessAccount?: IBusinessBankAccount;
    businessBio?: string;
    notifications?: INotificationSettings;
    social?: ISocialLinks;
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
export interface IBusinessAdmin {
    userId: string;
    username: string;
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
