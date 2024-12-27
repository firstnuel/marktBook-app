import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

export interface ISaleDocument extends Document {
    _id: ObjectId;
    customerId?: ObjectId;
    customerName: string;
    businessId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    initiatedBy: ObjectId;
    completedBy?: ObjectId;
    subtotalAmount: number; // before tax
    taxAmount?: number;
    taxRate?: number;
    currency: Currency;
    paymentMethod: PaymentMethod;
    paymentRef?: string;
    discount?: {
        type: DiscountType;
        value: number;
        maxAmount?: number;
    };
    status: SaleStatus;
    refundStatus?: RefundStatus;
    
    // Items and calculations
    saleItems: [SaleItem, ...SaleItem[]]; // Ensure at least one item
    totalPrice: number;
}


export interface ISaleData {
    customerId?: ObjectId;
    customerName: string;
    subtotalAmount: number; // before tax
    taxAmount?: number;
    taxRate?: number;
    currency: Currency;
    paymentRef?: string;
    paymentMethod: PaymentMethod;
    discount?: {
        type: DiscountType;
        value: number;
        maxAmount?: number;
    };
    status: SaleStatus;
    saleItems: [SaleItem, ...SaleItem[]]; // Ensure at least one item
    totalPrice: number;
}


export enum Currency {
    NGN = 'NGN',
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP'

}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    CREDIT = 'CREDIT',
    BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum SaleStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum RefundStatus {
    NONE = 'NONE',
    PENDING = 'PENDING',
    PARTIAL = 'PARTIAL',
    FULL = 'FULL',
    REJECTED = 'REJECTED'
}

export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED = 'FIXED'
}

export interface SaleItem {
    productId: ObjectId;
    productName: string;        // product name at time of sale
    productSKU: string;        // product SKU at time of sale
    unitSalePrice: number;
    quantity: number;
    subtotal: number;          // unitSalePrice * quantity
    discount?: {
        type: DiscountType;
        value: number;
    };
}


export const validateTotals = (sale: ISaleDocument): boolean => {
  // Calculate the subtotal from sale items
  const calculatedSubtotal = sale.saleItems.reduce(
    (sum, item) => sum + (item.unitSalePrice * item.quantity),
    0
  )
  
  // Calculate the total tax from taxRate
  const calculatedTax = (calculatedSubtotal - (sale.discount?.type === DiscountType.PERCENTAGE
    ? Math.min((sale.discount.value / 100) * calculatedSubtotal, sale.discount.maxAmount || Infinity)
    : sale.discount?.value || 0)
  ) * ((sale.taxRate ?? 0) / 100)
  
  // Calculate discount value
  const discountValue = sale.discount
    ? sale.discount.type === DiscountType.PERCENTAGE
      ? Math.min((sale.discount.value / 100) * calculatedSubtotal, sale.discount.maxAmount || Infinity)
      : sale.discount.value
    : 0
  
  // Calculate the total price
  const calculatedTotal = calculatedSubtotal - discountValue + calculatedTax
  
  // Perform validations
  return (
    Math.abs(calculatedSubtotal - sale.subtotalAmount) < 0.01 && // Subtotal validation
      Math.abs(calculatedTax - (sale.taxAmount ?? 0)) < 0.01 &&    // Tax validation
      Math.abs(calculatedTotal - sale.totalPrice) < 0.01           // Total price validation
  )
}
  
