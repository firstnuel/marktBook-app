import { z } from 'zod'
import { BusinessRole } from '@business/interfaces/business.interface'
import { email, username } from '@auth/schemes/authValidation'

// Zod schema for IuserData
export const userSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim(),
  email,
  mobileNumber: z.string().min(8, { message: 'Mobile number must be at least 8 characters long' }),
  role: z.nativeEnum(BusinessRole, { required_error: 'Role is required' }),
  status: z.enum(['active', 'inactive'], { required_error: 'Status is required' }),
  address: z.string().optional(),
  nin: z.string().optional(),
  businessId: z.string({required_error: 'business Id is required'}),
  username
})
