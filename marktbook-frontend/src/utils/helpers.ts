import { ZodError } from 'zod'

export const validationErrorFn = (msg: string , fn: (value: React.SetStateAction<string | null>) => void): void => {
  fn(msg)
  setTimeout(() => {
    fn(null)
  }, 5000)
}

export const parseZError = (error: ZodError): string =>
  error.errors.map(error => error.message).join(', ')


export const cutName = (name: string, amount: number=0): string => {
  amount = amount < 1? 15 : amount
  if(name.length > amount ) {
    return name.substring(0, amount) + '...'
  }
  return name
}
