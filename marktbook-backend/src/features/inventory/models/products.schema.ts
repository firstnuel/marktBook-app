import { Currency, IProductDocument, ProductCategory, ProductType, Unit } from '@inventory/interfaces/products.interface'
import { model, Model, Schema } from 'mongoose'

const ProductSchema: Schema<IProductDocument> = new Schema(
  {
    stockId: { 
      type: Schema.Types.Mixed, 
    },
    sku: { 
      type: String, 
      unique: true, // Enforce uniqueness
      required: [true, 'SKU is required'], // Ensure SKU is mandatory
      trim: true // Sanitize input by trimming whitespace
    },
    productName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    currency: {
      type: String,
      requird: true,
      enum: Object.values(Currency)
    },
    businessId: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
    longDescription: { 
      type: String, 
      trim: true 
    },
    shortDescription: { 
      type: String, 
      trim: true 
    },
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
    barcode: { 
      type: String, 
      trim: true 
    },
    productVariants: [{
      productId: { 
        type: Schema.Types.Mixed 
      },
      variantName: { 
        type: String 
      },
      sku: { 
        type: String, 
        unique: false, 
        sparse: true, 
        default: null 
      },
      barcode: String,
      priceAdjustment: { 
        type: Number, 
        default: 0 
      },
      attributes: [{
        name: String,
        value: String
      }],
      images: [{
        url: { 
          type: String 
        },
        isPrimary: { 
          type: Boolean, 
          default: false 
        }
      }],
      stockId: { 
        type: Schema.Types.Mixed 
      }
    }],
    basePrice: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    salePrice: { 
      type: Number, 
      min: 0 
    },
    discount: { 
      type: Number, 
      min: 0  
    },
    unit: { 
      type: String, 
      enum: Object.values(Unit), 
      required: true 
    },
    productImages: [{
      url: { 
        type: String, 
      },
      isPrimary: { 
        type: Boolean, 
        default: false 
      }
    }],
    tags: [{ 
      type: String, 
      trim: true 
    }],
    supplierId: { 
      type: Schema.Types.Mixed 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },
    createdBy: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
    updatedBy: { 
      type: Schema.Types.Mixed, 
      required: true 
    }
  },
  {
    timestamps: true,  // Automatically manage createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// indexes for performance
ProductSchema.index({ sku: 1 }, { unique: true })
ProductSchema.index({ productVariants: 1 }) 
ProductSchema.index({ productName: 'text' })
ProductSchema.index({ productCategory: 1 })
ProductSchema.index({ productType: 1 })
ProductSchema.index({ isActive: 1 })


const ProductModel: Model<IProductDocument> = model<IProductDocument>('Product', ProductSchema, 'Product')

export  { ProductModel }
