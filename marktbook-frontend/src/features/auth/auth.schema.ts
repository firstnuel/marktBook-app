import { BusinessCategory, BusinessType } from '@typess/auth'
import { z } from 'zod'

export const password = z
  .string()
  .min(4, 'Password must be at least 4 characters')
  .max(20, 'Password must be at less than 20 characters')


export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email format'),
  password,
  username: z.string().min(4, 'Username must be at least 4 characters'),
})

export const RegisterDataSchema = z.object({
  email: z.string().email('Invalid email format'),
  adminFullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(4, 'Username must be at least 4 characters'),
  password,
  businessName: z.string().min(3, 'Business name must be at least 3 characters'),
  businessType: z.nativeEnum(BusinessType, { errorMap: () => ({ message: 'Invalid business type' }) }),
  businessCategory: z.nativeEnum(BusinessCategory, { errorMap: () => ({ message: 'Invalid business category' }) }),
})


export const passwordSchema = z
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