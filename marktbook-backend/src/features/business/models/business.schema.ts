import { IBusinessDocument } from '@business/interfaces/business.interface'
import { model, Model, Schema } from 'mongoose'
import { BusinessCategory, BusinessType } from '@auth/interfaces/auth.interface'

const businessSchema: Schema = new Schema(
  {
    verifiedStatus: { type: Boolean, default: false },
    verifyData: {
      owner: { type: String, required: false },
      TIN: { type: String, required: false },
      CAC: { type: String, required: false },
      location: { type: String, required: false },
    },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    
    admins: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true }
      }
    ],
    customCategories: { type: [String], default: [] },
    businessImg: { type: String, required: false },
    currency: { type: String, required: true, default: 'USD' },
    businessLogo: { type: String, required: false },
    uId: { type: String, required: false },
    taxRate: { type: Number, required: false},
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
      accountName: { type: String, required: false },
      accountNumber: { type: String, required: false },
      bankName: { type: String, required: false },
      accountType: { type: String, required: false },
    },
    phoneNumber: { type: String, required: false },
    notifications: {
      sales: { type: Boolean, default: true },
      stockLevel: { type: Boolean, default: true },
      dueCreditSales: { type: Boolean, default: true },
      userDataChange: { type: Boolean, default: true },
    }
  },
  {
    timestamps: true,
  }
)

export const BusinessModel: Model<IBusinessDocument> = model<IBusinessDocument>('Business', businessSchema, 'Business')
