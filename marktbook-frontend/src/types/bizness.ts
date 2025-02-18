import { BusinessCategory, BusinessType, User } from './auth'
import { Currency } from './pos'


type mainOption =
  | 'Business'
  | 'Payments'
  | 'Manage Accounts'
  | 'Notifications'

type subOption =
  | 'Edit User'
  | 'None'

export interface BusinessState {
    business: Business | null
    error: string | null,
    success: string | null,
    loading: boolean,
    mainOpt: mainOption
    subOpt: subOption,
    users: User[]
    user: User | null
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
    uId?: string;
    businessCategory?: BusinessCategory;
    businessAddress?: string;
    businessType?: BusinessType;
    businessAccount?: IBusinessBankAccount;
    phoneNumber?: string;
    notifications?: INotificationSettings;
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
    sales?: boolean;
    stockLevel?: boolean;
    dueCreditSales?: boolean;
    userDataChange?: boolean;
  }

