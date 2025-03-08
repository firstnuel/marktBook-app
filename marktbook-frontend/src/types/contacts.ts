type MainOption =
    | 'Customers'
    | 'Suppliers'

type SubOption =
    | 'None'
    | 'Edit Customer'
    | 'Edit Supplier'


export interface contactsState {
    mainOpt: MainOption
    subOpt: SubOption
    loading: boolean
    success: string | null
    error: string | null
    supplier: Supplier | null
    customer: Customer | null
    suppliers: Supplier[]
    customers: Customer[]
}

export interface Customer {
    _id: string;
    businessId: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    customerType: 'Individual' | 'Business';
    businessName?: string
    createdAt?: Date;
    updatedAt?: Date;
    marketingOptIn?: boolean;
}


export type SupplierType = 'Manufacturer' | 'Distributor' | 'Retailer' | 'Wholesaler';

export type PaymentMethod = 'Bank Transfer' | 'Cash' | 'Credit Card' | 'Cheque'

export interface Supplier {
    _id: string;
    businessId: string;
    name: string;
    contactPerson: string;
    supplierType: SupplierType,
    email?: string;
    phone?: string;
    address?: string;
    companyName?: string;
    preferredPaymentMethod? : PaymentMethod;
    createdAt?: Date;
    updatedAt?: Date;
}