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
  username,
})

const emergencyContactSchema = z.object({
  name: z.string().optional(),
  relationship: z.string().optional(),
  contactNumber: z.string().optional(),
}).optional()

const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
}).optional()

export const editUserSchema = z.object({
  _id: z.union([z.string(), z.instanceof(Object)]).optional(),
  authId: z.union([z.string(), z.instanceof(Object)]).optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  uId: z.string().optional(),
  mobileNumber: z.string().optional(),
  role: z.enum(['Owner', 'Manager', 'Staff', 'Other']).optional(), // Adjust `BusinessRole` as needed
  status: z.enum(['active', 'inactive']).optional(),
  address: z.string().optional(),
  nin: z.string().optional(),
  username: z.string().optional(),
  associatedBusinessesId: z.union([z.string(), z.instanceof(Object)]).optional(),
  emergencyContact: emergencyContactSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  lastLogin: z.date().optional(),
  notificationPreferences: notificationPreferencesSchema,
  languagePreference: z.string().optional(),
  isVerified: z.boolean().optional(),
  profilePicture: z.string().optional(),
})

