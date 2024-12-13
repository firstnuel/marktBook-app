import { z } from  'zod'
import { ProductType, ProductCategory, Unit, Currency } from '@inventory/interfaces/products.interface'


const ProductImage = z.object({
    url: z.string(),
    isPrimary: z.boolean()
})


const ProductVariant = z.object({
    productId: z.string(),
    variantName:z.string(),
    sku: z.string(),
    barcode: z.string(),
    priceAdjustment: z.number().min(0, {message: 'Price adjustment must be non-negative'}),
    attributes: z.array(z.object({ name: z.string(), value: z.string() })),
    images: z.array(ProductImage).min(1, {message: 'At least one product image is required'}),
    stockId: z.string()
})


export const productSchema = z.object({
    sku: z.string(),
    currency: z.nativeEnum(Currency),
    productName: z.string({required_error: 'product name is required'}),
    businessId: z.string({required_error: 'business Id is required'}),
    longDescription: z.string().optional(),
    shortDescription: z.string().optional(),
    productCategory: z.nativeEnum(ProductCategory),
    productType: z.nativeEnum(ProductType),
    barcode: z.string().optional(),
    productVariants: z.array(ProductVariant).optional(),
    basePrice: z.number({required_error: 'Base price is required'}).min(0),
    salePrice: z.number().optional(),
    unit: z.nativeEnum(Unit),
    discount: z.number().default(0),
    productImages: z.array(ProductImage).optional(), //.min(1, {message: 'At least one product image is required'}),
    tags: z.array(z.string()).optional(),
    supplierId: z.string().optional(),
    isActive: z.boolean().default(false),
})



