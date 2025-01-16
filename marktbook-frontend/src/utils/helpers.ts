import { ZodError } from 'zod'
import { PriceInfo, CartItemProps } from '@typess/pos'


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

export const calculatePrice = (cartItems: CartItemProps[], tx: number=10): PriceInfo => {
  let subtotal: number = 0, total: number = 0, discount: number = 0

  for (const { product, quantity } of cartItems) {
    subtotal += product.basePrice * quantity
    discount += product.discountPercentage * quantity
    total += product.salePrice * quantity
  }

  return {
    subtotal,
    discount: Math.max(0, Math.round(discount)),
    total: total + (total * (tx/100)),
    tax: Math.max(0, Math.round(total * (tx/100)))
  }
}

export const updateDiscount = (priceinfo: PriceInfo, newDiscount: number, tx: number=10): PriceInfo => {
  const newTotal = priceinfo.subtotal - newDiscount

  return {
    subtotal: priceinfo.subtotal,
    discount: newDiscount,
    total: newTotal,
    tax: Math.max(0, Math.round(newTotal * (tx/100)))
  }
}