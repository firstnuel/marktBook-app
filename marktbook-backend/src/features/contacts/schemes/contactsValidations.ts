import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string({required_error: 'Customer name is required'}),
  email: z.string().optional(),
  businessId: z.string({required_error: 'businessId is required'}),
  phone: z.string().optional(),
  address: z.string().optional(),
  customerType: z.enum(['Individual', 'Business']),
  businessName: z.string().optional(),
  marketingOptIn: z.boolean().optional()
})

