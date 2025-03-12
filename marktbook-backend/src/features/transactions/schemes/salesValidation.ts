import { z } from 'zod'
import { Currency, PaymentMethod, SaleStatus, DiscountType } from '@transactions/interfaces/sales.interface'

const discount = z.object({
  type: z.nativeEnum(DiscountType),
  value: z.number({ required_error: 'discountValue is required'}),
  maxAmount:  z.number().optional(),
}).optional()


const saleItems = z.object({
  productId: z.string({ required_error: 'productId is required'}),
  productName: z.string({ required_error: 'productName is required'}),
  productSKU: z.string({ required_error: 'productName is required'}),
  unitSalePrice: z.number({ required_error: 'unitSalePrice value is required'}),
  quantity: z.number({ required_error: 'quantity value is required'}).min(1),
  subtotal: z.number({ required_error: 'subtotal value is required'}),
  discount
})


export const salesDataSchema = z.object({
  customer: z.string().optional(),
  subtotalAmount: z.number().optional(),
  taxAmount: z.number().optional(),
  currency: z.nativeEnum(Currency),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentRef: z.string().optional(),
  discount,
  saleItems: z.array(saleItems),
  totalPrice: z.number({ required_error: 'totalPrice value is required'}),
  businessId: z.string(),
})

export const saleStatusSchema = z.object({
  status: z.nativeEnum(SaleStatus)
})

export const returnSaleSchema = z.object({
  items: z.array(saleItems).optional(),
  reason: z.string({ required_error: 'reason is required'}),
})