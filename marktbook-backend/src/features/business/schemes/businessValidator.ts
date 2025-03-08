import { z } from 'zod'
import { BusinessCategory, BusinessType, } from '@auth/interfaces/auth.interface'

const businessAccount = z.object({
  accountName: z.string({ required_error: 'accountName  is required' }).trim(),
  accountNumber: z.string({ required_error: 'accountNumber  is required' }).trim(),
  bankName: z.string({ required_error: 'bankName is required' }).trim(),
  accountType:  z.string().trim().optional(),
}).optional()

const notifications = z.object({
  sales: z.boolean({ required_error: 'value is required for sales'}),
  stockLevel: z.boolean({ required_error: 'value is required for stockLevel'}),
  dueCreditSales: z.boolean({ required_error: 'value is required for dueCreditSales'}),
  userDataChange: z.boolean({ required_error: 'value is required for userDataChange'}),
}).optional()
  

export const editBusinessSchema = z.object({
  businessLogo: z.string().trim().optional(),
  businessName: z.string().trim().optional(),
  businessAddress: z.string().trim().optional(),
  businessBio: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  businessCategory: z.nativeEnum(BusinessCategory).optional(),
  businessType: z.nativeEnum(BusinessType).optional(),
  businessAccount,
  notifications,
})
