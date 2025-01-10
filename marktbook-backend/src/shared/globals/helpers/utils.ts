/* eslint-disable @typescript-eslint/no-explicit-any */
import { z, ZodError } from 'zod'
import sanitize from 'sanitize-html'
import mongoose from 'mongoose'


export class Utils {
  static firstLetterToUpperCase(str: string): string {
    if (!str) return ''

    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  static lowerCase(str: string): string {
    return str.toLowerCase()
  }
  
  static generateRandomIntegers(length: number): number {
    if (length <= 0) {
      throw new Error('Length must be a positive integer.')
    }
    const min = Math.pow(10, length - 1)
    const max = Math.pow(10, length) - 1
  
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static schemaParser<T>(
    schema: z.ZodSchema<T>, 
    data: unknown
  ): string | boolean {
    try {
      schema.parse(data)
      return true 
    } catch (error) {
      if (error instanceof ZodError) {
        return error.errors
          .map(err => {
            const path = err.path.length > 0 ? `${err.path.join('.')}: ` : ''
            return `${path}${err.message}`
          })
          .join('; ')
      }
      throw error
    }
  }

  static sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      return sanitize(data)
    } else if (Array.isArray(data)) {
      return data.map(item => this.sanitizeInput(item))
    } else if (data !== null && typeof data === 'object') {
      const sanitizedObject: Record<string, any> = {}
      Object.keys(data).forEach(key => {
        sanitizedObject[key] = this.sanitizeInput(data[key])
      })
      return sanitizedObject
    }
    return data
  }

  static isValidImage(input: any): boolean {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  
    if (!input) return false
  
    if (typeof input === 'string') {
      return /^data:image\/(jpeg|png|gif|webp);base64,/.test(input) && 
             Buffer.byteLength(input, 'base64') <= maxSize
    }
  
    return input?.mimetype && 
           validTypes.includes(input.mimetype) && 
           input.size <= maxSize
  }

  static isValidObjectId (id: string): boolean { 
    return mongoose.Types.ObjectId.isValid(id)
  }

  
    
}