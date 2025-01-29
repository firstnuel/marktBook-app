import { ProductAttributes, ProductCategory, ProductType, ProductVariants } from './pos'

type MainOption =
    | 'Products'
    | 'Create Products'
    | 'Stock Data'
    | 'Products Variants'
    | 'Categories'
    | 'Print QR codes'

type SubOption =
    | 'Product List'
    | 'Edit Product'

export interface invState {
    mainOpt: MainOption
    subOpt: SubOption
    product: IProduct | null
    stock: IStock | null
    error: string | null
    loading: boolean
    success: boolean
    successMsg: string | null
}

export interface IProduct {
    _id: string;
    stockId: string;
    currency: Currency;
    sku: string;
    productName: string;
    businessId: string;
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
    supplierId: string;
    isActive: boolean;
    discount?: number;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: string;
    updatedBy?: string;
}

export enum Currency {
    Naira = 'NGN',
    Dollars = 'USD',
    Euros = 'EUR'
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

export interface IStock {
    businessId: string;
    productId: string;
    locationId?: string;
    unitsAvailable: number;
    maxQuantity: number;
    minQuantity: number;
    thresholdAlert: boolean;
    compartment: string;
    lastRestocked: Date;
    costPerUnit?: number;
    totalValue?: number;
    supplierId?: string;
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: string;
    updatedBy?: string;
    locationData? : ILocationData
}

export interface IStockData {
    businessId: string;
    productId: string;
    unitsAvailable: number;
    maxQuantity: number;
    minQuantity: number;
    thresholdAlert: boolean;
    costPerUnit?: number;
    totalValue?: number;
    supplierId?: string;
    compartment?: string;
    notes?: string;
    //location Data
    locationName: string;
    locationType: LocationTypes;
    address: string;
    locationStatus: Status;
    capacity?: number;
}

export interface ILocation {
    _id: string;
    stocks: string[];
    locationName: string;
    businessId:  string;
    locationType: LocationTypes;
    address: string;
    currentLoad?: number;
    capacity?: number;
    manager: string;
    locationStatus: Status;
    stockMovements: Array<StockMovement>
}

export enum Status {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
}

export enum LocationTypes {
    WAREHOUSE = 'WAREHOUSE',
    SHOP = 'SHOP',
    STORAGE_UNIT = 'STORAGE_UNIT',
    MOBILE_UNIT = 'MOBILE_UNIT',
    KIOSK = 'KIOSK',
    OFFICE = 'OFFICE',
    DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',
}

export interface StockMovement {
    productId: string;
    movementType: MovementType;
    quantity: number;
    destination: string;
    initiatedBy: string;
    reason: string;
    timestamp: Date;
}

export interface ILocationData {
    locationName: string;
    locationType: LocationTypes;
    address?: string;
    capacity?: number;
    manager?: string;
    currentLoad?: number;
    locationStatus?: Status;
}

export interface EditStockData {
    compartment?: string;
    unitsAvailable?: number;
    maxQuantity?: number;
    minQuantity?: number;
    thresholdAlert?: boolean;
    costPerUnit: number;
    notes?: string;
}