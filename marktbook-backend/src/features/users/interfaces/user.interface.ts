import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import { BusinessRole } from '@business/interfaces/business.interface'

export interface IuserDocument extends Document {
    _id: string | ObjectId;
    authId: string | ObjectId;
    name: string;
    email: string;
    uId?: string,
    mobileNumber: string;
    role: BusinessRole;
    status: 'active' | 'inactive'; 
    address: string;
    nin: string;
    username: string;
    associatedBusinessesId: string | ObjectId;
    emergencyContact?: {
      name: string;
      relationship: string;
      contactNumber: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    notificationPreferences?: {
      emailNotifications: boolean;
      smsNotifications: boolean;
    };
    languagePreference?: string;
    isVerified?: boolean;
    profilePicture?: string;
    }
    
export interface IUserJob {
    value?: string | IuserDocument;
  }

export interface IEmailJob {
    receiveEmail: string;
    template: string;
    subject: string;
  }


export interface IuserData {
  name: string;
  email: string;
  mobileNumber?: string;
  role: BusinessRole;
  status: 'active' | 'inactive'; 
  address?: string;
  nin?: string;
  username: string;
  businessId: string | ObjectId;
}

export const USER_UPDATE_FIELDS: (keyof IuserDocument)[] = [
  'name',
  'mobileNumber',
  'address',
  'nin',
  'emergencyContact',
  'notificationPreferences',
  'languagePreference',
  'profilePicture',
]

export const ADMIN_UPDATE_FIELDS: (keyof IuserDocument)[] = [
  'name',
  'mobileNumber',
  'role',
  'status',
  'address',
  'nin',
  'emergencyContact',
  'profilePicture',
  'notificationPreferences',
  'languagePreference',
  'isVerified',
]

export function filterAllowedFields(data: Partial<IuserDocument>, ALLOWED_UPDATE_FIELDS:  (keyof IuserDocument)[]): Partial<IuserDocument> {
  return Object.keys(data)
    .filter(key => ALLOWED_UPDATE_FIELDS.includes(key as keyof IuserDocument))
    .reduce((obj, key) => {
      obj[key as keyof IuserDocument] = data[key as keyof IuserDocument]
      return obj
    }, {} as Partial<IuserDocument>)
}