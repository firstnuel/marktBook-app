import { ZodError } from 'zod'
import { PriceInfo, CartItemProps, Product, PaymentMethod } from '@typess/pos'
import { timeDay } from 'd3-time'


export const validationErrorFn = (msg: string , fn: (value: React.SetStateAction<string | null>) => void): void => {
  fn(msg)
  const timer = setTimeout(() => {
    fn(null)
  }, 5000)

  return clearTimeout(timer)
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

export const calculatePrice = (cartItems: CartItemProps[], tx: number=10, paymentMethod: PaymentMethod ): PriceInfo => {
  let subtotal: number = 0, total: number = 0, discount: number = 0

  for (const { product, quantity } of cartItems) {
    subtotal += product.basePrice * quantity
    discount += product.discount * quantity
    total += product.salePrice * quantity
  }

  return {
    subtotal,
    discount: Math.max(0, Math.round(discount)),
    total: total + (total * (tx/100)),
    tax: Math.max(0, Math.round(total * (tx/100))),
    paymentMethod
  }
}

export const updateDiscount = (priceinfo: PriceInfo, newDiscount: number, tx: number=10,  paymentMethod: PaymentMethod ): PriceInfo => {
  const newTotal = priceinfo.subtotal - newDiscount

  return {
    subtotal: priceinfo.subtotal,
    discount: newDiscount,
    total: newTotal + (newTotal * (tx/100)),
    tax: Math.max(0, Math.round(newTotal * (tx/100))),
    paymentMethod
  }
}

export const countByCategoryList = (products: Product[]) => {
  const counts = products.reduce((acc: { [key: string]: number }, product) => {
    const category = product.productCategory
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => {
    // Primary sort by count (descending)
      if (b.count !== a.count) return b.count - a.count
      // Secondary sort by category (alphabetical ascending)
      return a.category.localeCompare(b.category)
    })
}

export const getCurrencySymbol = (currency: string): string => {

  switch (currency) {
  case 'USD':
    return '$'
  case 'NGN':
    return '₦'
  case 'EUR':
    return '€'
  default:
    return '$'
  }
}

export const getLastSeen = (timeString: string ): string => {
  if (!timeString || timeString === '') {
    return '-'
  }
  const end = new Date()
  const start = new Date(timeString)

  const days = timeDay.count(start, end)

  if (days < 1) {
    return 'Today'
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days === 30) {
    return `${Math.floor(days / 30)} months ago`
  } else {
    return `${days} days ago`
  }

}

export const handleFullScreen = () => {
  document.documentElement.requestFullscreen()
    .catch(err => console.log(err))
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}