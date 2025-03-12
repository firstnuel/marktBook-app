type mainOption =
  | 'Sales'
  | 'Invoices'
  | 'Sales Return'
  | 'Purchases'
  | 'Purchase Return'

type subOption =
  | 'None'
  | 'View Invoice'
  | 'View Sale'

export interface transState {
  sales: Sale[]
  invoices: Sale[]
  salesReturn: Sale[]
  purchases: []
  purchaseReturn: []
  error: string | null,
  success: string | null,
  loading: boolean,
  mainOpt: mainOption
  subOpt: subOption,
  sale: Sale | null,
}

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

export interface SaleItem {
    productId: string;
    productName: string;
    productSKU: string;
    unitSalePrice: number;
    quantity: number;
    subtotal: number;
    discount?: Discount;
  }

export interface Sale {
    customer: Customer | null;
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
    updatedAt?: string;
    id: string;
    completedBy?: InitiatedBy
  }
