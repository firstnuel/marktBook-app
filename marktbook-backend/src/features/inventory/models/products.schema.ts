import { Currency, IProductDocument, ProductCategory, ProductType, Unit } from '@inventory/interfaces/products.interface'
import { model, Model, Schema } from 'mongoose'

const ProductSchema: Schema<IProductDocument> = new Schema(
  {
    stockId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Stock'
    },
    businessId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Business',
      required: true 
    },
    supplierId: { 
      type: Schema.Types.ObjectId,
      ref: 'Supplier'
    },
    sku: { 
      type: String, 
      required: [true, 'SKU is required'],
      trim: true
    },
    productName: { 
      type: String, 
      required: true, 
      trim: true
    },
    currency: {
      type: String,
      required: true,
      enum: Object.values(Currency)
    },
    longDescription: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    productCategory: { 
      type: String, 
      enum: Object.values(ProductCategory), 
      required: true 
    },
    productType: { 
      type: String, 
      enum: Object.values(ProductType), 
      required: true 
    },
    barcode: { type: String, trim: true },
    productVariants: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      variantName: { type: String },
      sku: { type: String, sparse: true, default: null },
      barcode: { type: String },
      priceAdjustment: { type: Number, default: 0 },
      attributes: [{ name: String, value: String }],
      images: [{
        url: { type: String, match: /^https?:\/\// }, 
        isPrimary: { type: Boolean, default: false }
      }],
      stockId: { type: Schema.Types.ObjectId, ref: 'Stock' }
    }],
    basePrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0 },
    unit: { type: String, enum: Object.values(Unit), required: true },
    productImages: [{
      url: { type: String, match: /^https?:\/\// },
      isPrimary: { type: Boolean, default: false }
    }],
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtual: Calculate discount percentage
ProductSchema.virtual('discountPercentage').get(function (this: IProductDocument) {
  if (this.discount && this.basePrice) {
    return (this.discount / this.basePrice) * 100
  }
  return 0
})

// Pre-save Hook: Validate that salePrice ≤ basePrice
ProductSchema.pre('save', function (next) {
  if (this.salePrice && this.salePrice > this.basePrice) {
    next(new Error('Sale price cannot be greater than base price.'))
  } else {
    next()
  }
})


ProductSchema.index({ productCategory: 1, isActive: 1 })
ProductSchema.index({ productName: 'text' })

const ProductModel: Model<IProductDocument> = model<IProductDocument>('Product', ProductSchema, 'Product')

export { ProductModel }
