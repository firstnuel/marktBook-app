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
    basePrice: number;
    salePrice: number;
    unit: Unit;
    productImages: ProductImage[];
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
    attributes: { name: string; value: string }[];
    images: ProductImage[];
    stockId: ObjectId | string;
}

export interface ProductImage {
    url: string;
    isPrimary: boolean;
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
    Other = 'Other',                        // For categories not explicitly defined
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
    productCategory: ProductCategory;
    productType: ProductType;
    barcode?: string;
    productVariants?: ProductVariants[];
    basePrice: number;
    salePrice?: number;
    discount?: number;
    unit: Unit;
    productImages?: ProductImage[];
    tags?: string[];
    supplierId?: ObjectId | string;
    isActive: boolean;
}


export interface IProductJob {
    value?: string | IProductDocument;
  }