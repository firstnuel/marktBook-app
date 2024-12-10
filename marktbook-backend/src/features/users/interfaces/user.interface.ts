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
    associatedBusinesses?: Array<{
        businessId: string | ObjectId;
        businessName: string;
        role: BusinessRole;
      }>;
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