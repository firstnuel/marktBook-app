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

export const calculatePrice = (cartItems: CartItemProps[], tx: number = 10, paymentMethod: PaymentMethod): PriceInfo => {
  let subtotal = 0, discount = 0

  for (const { product, quantity } of cartItems) {
    subtotal += product.basePrice * quantity
    discount += product.discount * quantity
  }

  discount = Math.min(discount, subtotal)
  const discountedSubtotal = subtotal - discount
  const tax = Math.round(discountedSubtotal * (tx / 100) * 100) / 100
  const total = discountedSubtotal + tax

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    tax,
    paymentMethod
  }
}

export const updateDiscount = (priceinfo: PriceInfo, newDiscount: number, tx: number = 10, paymentMethod: PaymentMethod): PriceInfo => {

  const validDiscount = Math.min(newDiscount, priceinfo.subtotal)
  const discountedSubtotal = priceinfo.subtotal - validDiscount
  const tax = Math.round(discountedSubtotal * (tx / 100) * 100) / 100
  const total = discountedSubtotal + tax

  return {
    subtotal: Math.round(priceinfo.subtotal * 100) / 100,
    discount: Math.round(validDiscount * 100) / 100,
    total: Math.round(total * 100) / 100,
    tax,
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


export const formattedNumber = (numArray: number[], secondNumArray?: number[]) => {
  let sum = numArray.reduce((acc, val) => acc + val, 0)
  if (secondNumArray) sum = sum - secondNumArray.reduce((acc, val) => acc + val, 0)

  return sum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export const sumNumber = (numArray: number[], secondNumArray?: number[]) => {
  let sum = numArray.reduce((acc, val) => acc + val, 0)
  if (secondNumArray) sum = sum - secondNumArray.reduce((acc, val) => acc + val, 0)

  return sum.toString()
}


export const percentageOf = (numArray: number[], secondNumArray: number[]): number => {
  const sum1 = numArray.reduce((acc, val) => acc + val, 0)
  const sum2 = secondNumArray.reduce((acc, val) => acc + val, 0)

  if (sum1 === 0 && sum2 > 0) {
    return -100
  }

  if (sum2 === 0 && sum1 > 0) {
    return 100
  }

  if (sum2 === 0) {
    return 0  // return 0 if both are 0, or no valid percentage can be calculated
  }

  return (sum1 / sum2) * 100
}
