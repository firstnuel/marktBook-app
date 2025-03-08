import { z } from 'zod'
import { LocationTypes, Status} from '@inventory/interfaces/location.interfaces'



const locationSchema = z.object({
  locationName: z.string({ required_error: 'Name of location is required'}),
  locationType: z.nativeEnum(LocationTypes),
  address: z.string({ required_error: 'Address of location is required'}),
  compartment: z.string().optional(),
  capacity: z.number().min(1, { message: 'capacity can not be less than 1'}).optional(),
  locationStatus: z.nativeEnum(Status)
}).optional()
export const StockDataSchema = z.object({
  businessId: z.string({required_error: 'business Id is required'})
    .refine((val) => /^[a-f\d]{24}$/i.test(val), {
      message: 'Invalid ObjectId for supplierId',
    }),
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
  //location Data
  locationSchema,
  locationId: z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
    message: 'Invalid ObjectId for locationId',
  }).optional(),
})

export const editStockSchema = z.object({
  businessId: z.string().optional(),
  productId: z.string().optional(),
  locationId: z.string().optional(),
  unitsAvailable: z.number().optional(),
  maxQuantity: z.number().optional(),
  minQuantity: z.number().optional(),
  thresholdAlert: z.boolean().optional(),
  lastRestocked: z.date().optional(),
  costPerUnit: z.number().optional(),
  totalValue: z.number().optional(),
  supplierId: z.string().optional(),
  notes: z.string().optional(),
})
