import { z, ZodError } from 'zod'

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
  }