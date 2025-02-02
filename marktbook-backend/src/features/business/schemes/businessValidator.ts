import { z } from 'zod'

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
  
const social = z.object({
  facebook: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  twitter: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  website: z.string().trim().optional(),
}).optional()

export const editBusinessSchema = z.object({
  businessLogo: z.string().trim().optional(),
  businessAddress: z.string().trim().optional(),
  businessBio: z.string().trim().optional(),
  businessAccount,
  notifications,
  social
})
