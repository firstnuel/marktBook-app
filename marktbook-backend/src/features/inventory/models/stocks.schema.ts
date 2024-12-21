import { model, Model, Schema } from 'mongoose'
import { IStockDocument } from '@inventory/interfaces/stock.interfaces'

const StockDataSchema: Schema<IStockDocument> = new Schema(
  {
    businessId: {
      type: Schema.Types.ObjectId, 
      ref: 'Business',
      required: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    compartment: { type: String },
    unitsAvailable: { type: Number, min: 0, required: true },
    maxQuantity: { type: Number, min: 1, required: true },
    minQuantity: { type: Number, min: 0, default: 0 },
    thresholdAlert: { type: Boolean, default: false },
    costPerUnit: { type: Number, min: 0, required: true },
    totalValue: { type: Number, min: 0 },
    notes: { type: String, maxlength: 500 }, 
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual: Automatically calculate total value if not provided
StockDataSchema.virtual('computedTotalValue').get(function (this: IStockDocument) {
  return (this.unitsAvailable ?? 0) * (this.costPerUnit ?? 0)
})

// Pre-save Hook: Auto-update `totalValue` if unitsAvailable or costPerUnit changes
StockDataSchema.pre('save', function (next) {
  // Update `totalValue` if unitsAvailable or costPerUnit changes
  if (this.isModified('unitsAvailable') || this.isModified('costPerUnit')) {
    this.totalValue = (this.unitsAvailable ?? 0) * (this.costPerUnit ?? 0)
  }

  // Update `thresholdAlert` if unitsAvailable <= minQuantity
  if (this.unitsAvailable <= this.minQuantity) {
    this.thresholdAlert = true
  } else {
    this.thresholdAlert = false
  }

  next()
})

StockDataSchema.index({ businessId: 1, locationId: 1, productId: 1 })

const StockModel: Model<IStockDocument> = model<IStockDocument>('Stock', StockDataSchema, 'Stock')

export { StockModel }
