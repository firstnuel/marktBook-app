import { z } from  'zod'
import { ProductType, ProductCategory, Unit, Currency, } from '@inventory/interfaces/products.interface'


const DimensionsSchema = z.object({
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
})

const ProductAttributesSchema = z.object({
  color: z.string().optional(),
  size: z.number().optional(),
  brand: z.string().optional(),
  manufacturer: z.string().optional(),
  dimensions: DimensionsSchema.optional(),
})


const ProductVariant = z.object({
  productId: z.string(),
  variantName:z.string(),
  sku: z.string(),
  barcode: z.string(),
  attributes: ProductAttributesSchema,
  priceAdjustment: z.number().min(0, {message: 'Price adjustment must be non-negative'}),
  image:  z.string().optional(),
  stockId: z.string()
})


export const productSchema = z.object({
  currency: z.nativeEnum(Currency),
  productName: z.string({required_error: 'product name is required'}),
  businessId: z.string({required_error: 'business Id is required'}),
  longDescription: z.string().optional(),
  shortDescription: z.string().optional(),
  productCategory: z.nativeEnum(ProductCategory),
  attributes: ProductAttributesSchema,
  productType: z.nativeEnum(ProductType),
  barcode: z.string().optional(),
  productVariants: z.array(ProductVariant).optional(),
  basePrice: z.number({required_error: 'Base price is required'}).min(0),
  salePrice: z.number().optional(),
  unit: z.nativeEnum(Unit),
  discount: z.number().default(0),
  productImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  supplierId: z.string().optional(),
  isActive: z.boolean().default(false),
})

export const categorySchema = z.object({
  category: z.nativeEnum(ProductCategory)
})

export const searchSchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  tags: z.array(z.string()).optional()
})

export const editProductSchema = z.object({
  _id: z.union([z.string(), z.instanceof(Object)]).optional(),
  stockId: z.union([z.string(), z.instanceof(Object)]).optional(),
  currency: z.string().optional(),
  sku: z.string().optional(),
  productName: z.string().optional(),
  businessId: z.union([z.string(), z.instanceof(Object)]).optional(),
  longDescription: z.string().optional(),
  shortDescription: z.string().optional(),
  productCategory: z.string().optional(),
  productType: z.string().optional(),
  barcode: z.string().optional(),
  productVariants: z.array(z.object({
    variantName: z.string(),
    price: z.number(),
    stock: z.number(),
  })).optional(),
  basePrice: z.number().optional(),
  salePrice: z.number().optional(),
  unit: z.string().optional(),
  productImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  supplierId: z.union([z.string(), z.instanceof(Object)]).optional(),
  isActive: z.boolean().optional(),
  discount: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.union([z.string(), z.instanceof(Object)]).optional(),
  updatedBy: z.union([z.string(), z.instanceof(Object)]).optional(),
})

