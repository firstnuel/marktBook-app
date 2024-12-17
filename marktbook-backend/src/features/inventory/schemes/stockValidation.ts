import { z } from 'zod'


export const StockDataSchema = z.object({
  businessId: z.string({required_error: 'business Id is required'}),
  locationId: z.string().optional(),
  unitsAvailable: z.number().min(0, { message: 'unitsAvailable must be a positive number' }),
  maxQuantity: z.number().positive({ message: 'maxQuantity must be greater than zero' }),
  minQuantity: z.number().min(0, { message: 'minQuantity must be a positive number' }),
  thresholdAlert: z.boolean(),
  costPerUnit: z.number().positive().optional(),
  totalValue: z.number().min(0).optional(),
  supplierId: z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
    message: 'Invalid ObjectId for supplierId',
  }).optional(),
  notes: z.string().max(500, { message: 'Notes must not exceed 500 characters' }).optional(),
})

