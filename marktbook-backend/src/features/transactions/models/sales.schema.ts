import { model, Schema, Model } from 'mongoose'
import {
  ISaleDocument,
  Currency,
  PaymentMethod,
  SaleStatus,
  DiscountType,
  RefundStatus,
} from '@transactions/interfaces/sales.interface'

// Sub-schema for discount
const discountSchema = new Schema(
  {
    type: { type: String, enum: Object.values(DiscountType) },
    value: { type: Number, required: true },
  },
  { _id: false }
)

// Sub-schema for sale items
const saleItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    productSKU: { type: String, required: true },
    unitSalePrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: discountSchema },
  },
  { _id: false }
)

// Main sales schema
const salesSchema: Schema<ISaleDocument> = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
    },
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    completedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    subtotalAmount: { type: Number, required: true },
    taxAmount: { type: Number },
    taxRate: { type: Number },
    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SaleStatus),
      required: true,
    },
    refundStatus: {
      type: String,
      enum: Object.values(RefundStatus),
      required: true,
    },
    totalPrice: { type: Number, required: true },
    paymentRef: { type: String },
    customerName: { type: String },
    discount: { type: discountSchema },
    saleItems: { type: [saleItemSchema], required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v } },
    toObject: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v } },
  }
)

const SaleModel: Model<ISaleDocument> = model<ISaleDocument>('Sale', salesSchema, 'Sale')
export { SaleModel }