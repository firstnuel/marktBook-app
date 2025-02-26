interface Customer {
    _id: string;
    name: string;
    address: string;
    businessName: string;
  }

  interface InitiatedBy {
    _id: string;
    name: string;
  }

  interface Discount {
    type: 'FIXED' | 'PERCENTAGE';
    value: number;
  }

  interface SaleItem {
    productId: string;
    productName: string;
    productSKU: string;
    unitSalePrice: number;
    quantity: number;
    subtotal: number;
    discount?: Discount;
  }

export interface Sale {
    customer: Customer;
    initiatedBy: InitiatedBy;
    subtotalAmount: number;
    taxAmount: number;
    taxRate: number;
    currency: string;
    paymentMethod: string;
    status: string;
    refundStatus: string;
    totalPrice: number;
    discount?: Discount;
    saleItems: SaleItem[];
    createdAt: string;
    id: string;
  }

