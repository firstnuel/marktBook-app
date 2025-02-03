export interface PosState {
    products: Product[];
    filteredProducts: Product[];
    cartItems: CartItemProps[];
    category: 'ALL' | (keyof typeof ProductCategory);
    searchKey: (keyof typeof SearchKeys);
    searchPhrase: string;
    loading: boolean;
    error: string | null;
    priceInfo: PriceInfo;
    successMsg: string | null;
}
interface Stock {
    _id: string;
    compartment: string;
    unitsAvailable: number;
    minQuantity: number;
    computedTotalValue: number;
    location: string;
    id: string;
  }

export interface CartItemProps {
    product: Product;
    quantity: number
  }

export interface PriceInfo {
  subtotal: number,
  total: number,
  discount: number
  tax: number
}

export enum SearchKeys {
    SKU = 'SKU',
    ProductName = 'Product Name',
    ProductTag = 'Product Tag',
    Category = 'Category',
    Barcode = 'Barcode',
  }
export enum Currency {
    Naira = 'NGN',
    Dollars = 'USD',
    Euros = 'EUR'
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

export enum ProductType {
    Physical = 'Physical',
    Digital = 'Digital',
    Service = 'Service',
    Subscription = 'Subscription',
    CustomOrder = 'Custom Order',
    Other = 'Other',
}

export interface ProductVariants {
    productId: string;
    variantName: string;
    sku: string;
    barcode?: string;
    priceAdjustment: number;
    attributes: ProductAttributes;
    image: string;
    stockId: string;
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
    Other = 'Other',
}

export type CustomCategory = string

export interface Product {
    _id: string;
    businessId: string;
    supplierId: string | null;
    attributes: ProductAttributes;
    sku: string;
    productName: string;
    currency: Currency;
    longDescription: string;
    shortDescription: string;
    productCategory: ProductCategory | CustomCategory;
    productType: ProductType;
    barcode: string;
    productVariants: ProductVariants[];
    productImage?: string;
    basePrice: number;
    salePrice: number;
    discount: number;
    unit: string;
    tags: string[];
    id: string;
    stock: Stock | null;
    discountPercentage: number;
  }
