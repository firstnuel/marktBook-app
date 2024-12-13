import { z } from 'zod'
import { BusinessType, BusinessCategory } from '@auth/interfaces/auth.interface'

export const password = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(4, { message: 'Invalid password' })
  .max(20, { message: 'Invalid password' })


export const email = z
  .string({
    required_error: 'email is required',
    invalid_type_error: 'email must be a string',
  })
  .email({ message: 'Field must be valid' })

export const username = z
  .string({
    required_error: 'Username is required',
    invalid_type_error: 'Username must be a string',
  })
  .min(4, { message: 'Invalid username' })
  .max(15, { message: 'Invalid username' })


const loginSchema = z.object({
  email,
  username,
  password,
})


const registerSchema = z.object({
  email: email.trim(),
  adminFullName: z.string({ required_error: 'Admin full name is required' }).trim(),
  password,
  businessName: z.string({ required_error: 'Business name is required' }).trim(),
  username,
  businessAddress: z.string().trim().optional(),
  businessType: z.nativeEnum(BusinessType),
  businessCategory: z.nativeEnum(BusinessCategory),
  businessLogo: z.string().trim().optional(),
})

const passwordSchema = z
  .object({
    password,
    confirmPassword: password,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords should match',
        path: ['confirmPassword'],
      })
    }
  })

const emailSchema = z.object({ email })

export { loginSchema, passwordSchema, registerSchema, emailSchema}



