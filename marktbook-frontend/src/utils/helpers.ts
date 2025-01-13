import { ZodError } from 'zod'

export const validationErrorFn = (msg: string , fn: (value: React.SetStateAction<string | null>) => void): void => {
  fn(msg)
  setTimeout(() => {
    fn(null)
  }, 5000)
}

export const parseZError = (error: ZodError): string =>
  error.errors.map(error => error.message).join(', ')


export const cutName = (name: string): string => {
  if(name.length > 10 ) {
    return name.substring(0, 10) + '...'
  }
  return name
}
