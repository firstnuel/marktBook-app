import { IBusinessDocument } from '@business/interfaces/business.interface'
import { model, Model, Schema } from 'mongoose'
import { BusinessCategory, BusinessType } from '@auth/interfaces/auth.interface'

const businessSchema: Schema = new Schema(
    {
    authId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Auth', 
        index: true, 
        required: true 
    },
    verifiedStatus: { type: Boolean, default: false },
    verifyData: {
      owner: { type: String, required: true },
      TIN: { type: String, required: true },
      CAC: { type: String, required: true },
      location: { type: String, required: true },
    },
    admins: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }], 
    businessLogo: { type: String, required: false },
    businessAddress: { type: String, required: false },
    businessType: { 
      type: String, 
      enum: Object.values(BusinessType), 
      required: false 
    },
    businessCategory: { 
        type: String, 
        enum: Object.values(BusinessCategory), 
        required: false 
      },
    businessAccount: {
      accountName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
      accountType: { type: String, required: false },
    },
    businessBio: { type: String, required: false },
    notifications: {
      sales: { type: Boolean, default: true },
      stockLevel: { type: Boolean, default: true },
      dueCreditSales: { type: Boolean, default: true },
      userDataChange: { type: Boolean, default: true },
    },
    social: {
      facebook: { type: String, required: false },
      instagram: { type: String, required: false },
      twitter: { type: String, required: false },
      youtube: { type: String, required: false },
      website: { type: String, required: false },
    },
    bgImageVersion: { type: String, required: true },
    bgImageId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)


export const BusinessModel: Model<IBusinessDocument> = model<IBusinessDocument>('Business', businessSchema, 'Business')
