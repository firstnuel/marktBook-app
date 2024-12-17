/* eslint-disable @typescript-eslint/no-explicit-any */
import { z, ZodError } from 'zod'
import sanitize from 'sanitize-html'


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

  static isValidImage(fileOrBase64: any): boolean {
    // Define allowed MIME types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  
    // Define maximum allowed size (e.g., 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
  
    if (!fileOrBase64) {
      return false
    }
  
    // Check if input is a base64 string
    if (typeof fileOrBase64 === 'string') {
      const base64Regex = /^data:image\/(jpeg|png|gif|webp);base64,/
      if (!base64Regex.test(fileOrBase64)) {
        return false
      }
  
      // Estimate size by decoding base64
      const sizeInBytes = Buffer.byteLength(fileOrBase64, 'base64')
      if (sizeInBytes > maxSizeInBytes) {
        return false
      }
  
      return true
    }
  
    // If input is a file object (e.g., from multer)
    if (typeof fileOrBase64 === 'object') {
      const { mimetype, size } = fileOrBase64
  
      if (!allowedMimeTypes.includes(mimetype)) {
        return false
      }
  
      if (size > maxSizeInBytes) {
        return false
      }
  
      return true
    }
  
    // Unsupported input type
    return false
  }
    
}