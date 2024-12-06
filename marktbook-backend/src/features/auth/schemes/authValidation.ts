import { z } from 'zod'
import { BusinessType, BusinessCategory } from '@auth/interfaces/auth.interface'

const password = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(4, { message: 'Invalid password' })
  .max(10, { message: 'Invalid password' })

const email = z.string().email({ message: 'Field must be valid' })

const username = z
  .string({
    required_error: 'Username is required',
    invalid_type_error: 'Username must be a string',
  })
  .min(4, { message: 'Invalid username' })
  .max(8, { message: 'Invalid username' })


const loginSchema = z.object({
  email,
  username,
  password,
})


const registerSchema = z.object({
  email,
  name: z.string({ required_error: 'Name is required' }),
  username,
  password,
  businessName: z.string({ required_error: 'Business name is required' }),
  businessAddress: z.string().optional(),
  businessType: z.nativeEnum(BusinessType),
  businessCategory: z.nativeEnum(BusinessCategory),
  businessLogo: z.string().optional(),
})


const passwordSchema = z
  .object({
    email,
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

export { loginSchema, passwordSchema, registerSchema}



