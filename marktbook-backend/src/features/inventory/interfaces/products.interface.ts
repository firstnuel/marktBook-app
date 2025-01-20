import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

export interface IProductDocument extends Document {
    _id: string | ObjectId;
    stockId: ObjectId | string;
    currency: Currency;
    sku: string;
    productName: string;
    businessId: string | ObjectId;
    longDescription: string;
    shortDescription: string;
    productCategory: ProductCategory;
    productType: ProductType;
    barcode?: string;
    productVariants: ProductVariants[];
    attributes: ProductAttributes;
    basePrice: number;
    salePrice: number;
    unit: Unit;
    productImage: string;
    tags?: string[];
    supplierId: ObjectId | string;
    isActive: boolean;
    discount?: number;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: ObjectId | string;
    updatedBy?: ObjectId | string;
}

export enum Currency {
    Naira = 'NGN',
    Dollars = 'USD',
    Euros = 'EUR'
}

export interface ProductVariants {
    productId: ObjectId | string;
    variantName: string;
    sku: string;
    barcode?: string;
    priceAdjustment: number;
    attributes: ProductAttributes;
    image: string;
    stockId: ObjectId | string;
}

export interface ProductAttributes {
  color?: string;
  size?: number;
  brand?: string;
  manufacturer?: string;
  dimensions?: {                 
    length?: number;          
    width?: number;         
    height?: number;   
    weight?: number;
  }
}

export enum ProductCategory {
    Electronics = 'Electronics',       
    Clothing = 'Clothing',     
    Grocery = 'Grocery',         
    Cosmetics = 'Cosmetics',          
    Furniture = 'Furniture',      
    Hardware = 'Hardware',                  
    Stationery = 'Stationery',
    Beverages = 'Beverages',  
    Pharmaceuticals = 'Pharmaceuticals',   
    Automotive = 'Automotive',    
    HomeAppliances = 'Home Appliances',
    Toys = 'Toys',            
    Food = 'Food',                 
    Jewelry = 'Jewelry',         
    Textiles = 'Textiles',                 
    Other = 'Other',                        // For categories not explicitly defined
}

export enum ProductType {
    Physical = 'Physical',                
    Digital = 'Digital',                   
    Service = 'Service',                
    Subscription = 'Subscription',         
    CustomOrder = 'Custom Order',          
    Other = 'Other',      // For categories not explicitly defined
}


export enum Unit {
    Kilogram = 'kg',               
    Gram = 'g',                
    Ton = 'ton',                   
    Liter = 'liter',              
    Milliliter = 'ml',            
    CubicMeter = 'm³',            
    CubicFeet = 'ft³',           
    Piece = 'piece',               
    Dozen = 'dozen',              
    Pack = 'pack',              
    Bundle = 'bundle',   
    Meter = 'm',    
    Pair = 'pair',    
    Centimeter = 'cm',           
    Millimeter = 'mm',            
    Feet = 'ft',             
    Inch = 'in',           
    Yard = 'yd',           
    SquareMeter = 'm²',        
    SquareFeet = 'ft²',         
    Acre = 'acre',              

    // Miscellaneous
    Box = 'box',                 
    Crate = 'crate',             
    Carton = 'carton',           
    Roll = 'roll',               
    Barrel = 'barrel',            
    Bag = 'bag',                  
    Sack = 'sack',                 

    // Custom Units
    Unit = 'unit',              
    Custom = 'custom',             
}

export interface IProductData {
    sku: string;
    currency: Currency;
    productName: string;
    businessId: string | ObjectId;
    longDescription?: string;
    shortDescription?: string;
    attributes: ProductAttributes;
    productCategory: ProductCategory;
    productType: ProductType;
    barcode?: string;
    productVariants?: ProductVariants[];
    basePrice: number;
    salePrice?: number;
    discount?: number;
    unit: Unit;
    productImage?: string;
    tags?: string[];
    supplierId?: ObjectId | string;
    isActive: boolean;
}


export interface IProductJob {
    value?: string | IProductDocument;
  }

export interface IFilterData {
    businessId: string | ObjectId;
    name?: string | { $regex: string; $options: string };
    sku?: string;
    barcode?: string;
    tags?: { $in: string[] };
}

export const ALLOWED_ALL_FIELDS: (keyof IProductDocument)[] = [
  'stockId',
  'currency',
  'productName',
  'longDescription',
  'shortDescription',
  'productCategory',
  'productType',
  'barcode',
  'productVariants',
  'basePrice',
  'salePrice',
  'attributes',
  'unit',
  'productImage',
  'tags',
  'supplierId',
  'isActive',
  'discount'
]


export const ALLOWED_STAFF_FIELDS: (keyof IProductDocument)[] = [
  'longDescription',
  'shortDescription',
  'tags',
  'productImage',
]



export function filterProductFields(
  data: Partial<IProductDocument>,
  filterKeys: (keyof IProductDocument)[]
): Partial<IProductDocument> {
  const filteredData: Partial<IProductDocument> = {}

  for (const key in data) {
    if (filterKeys.includes(key as keyof IProductDocument)) {
      filteredData[key as keyof IProductDocument] = data[key as keyof IProductDocument]
    }
  }

  return filteredData
}