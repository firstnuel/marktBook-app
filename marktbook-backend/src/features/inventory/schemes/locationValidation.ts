import { z } from 'zod'
import { LocationTypes, MovementType, Status} from '@inventory/interfaces/location.interfaces'


export const locationSchema = z.object({
  name: z.string({ required_error: 'Name of location is required'}),
  type: z.nativeEnum(LocationTypes),
  address: z.string({ required_error: 'Address of location is required'}),
  capacity: z.number().min(1, { message: 'Capacity can not be less than 1'}).optional(),
  status: z.nativeEnum(Status),
  manager: z.string().optional(),
  currentLoad: z.number().optional()
})


export const movementSchema = z.object({
  productId: z.string({ required_error: 'ProductId is required'}),
  movementType: z.nativeEnum(MovementType),
  quantity: z.number({ required_error: 'Quantity is required'}).min(1, { message: 'quantity can not be less than 1'}),
  destination: z.string({ required_error: 'Destination is required'}),
  reason: z.string({ required_error: 'Reason is required'}),
})
