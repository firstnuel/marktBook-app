import { z } from 'zod'
import { SuppierType, PaymentMethod } from '@contacts/interfaces/contacts.interface'

export const customerSchema = z.object({
  name: z.string({required_error: 'Customer name is required'}),
  email: z.string(),
  businessId: z.string({required_error: 'businessId is required'}),
  phone: z.string().optional(),
  address: z.string().optional(),
  customerType: z.enum(['Individual', 'Business']),
  businessName: z.string().optional(),
  marketingOptIn: z.boolean().optional()
})

export const editCustomerSchema = z.object({
  name: z.string({required_error: 'Customer name is required'}).optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  customerType: z.enum(['Individual', 'Business']).optional(),
  businessName: z.string().optional(),
  marketingOptIn: z.boolean().optional()
})


export const supplierSchema = z.object({
  name: z.string({ required_error: 'Supplier name is required' }),
  email: z.string().email({ message: 'Invalid email format' }).optional(),
  businessId: z.string({ required_error: 'businessId is required' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  supplierType: z.nativeEnum(SuppierType, { required_error: 'Supplier type is required', }),
  companyName: z.string().optional(),
  preferredPaymentMethod: z.nativeEnum(PaymentMethod).optional(),
})

export const editSupplierSchema = z.object({
  name: z.string({ required_error: 'Supplier name is required' }).optional(),
  email: z.string().email({ message: 'Invalid email format' }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  supplierType: z.nativeEnum(SuppierType).optional(),
  companyName: z.string().optional(),
  preferredPaymentMethod: z.nativeEnum(PaymentMethod).optional(),
})
