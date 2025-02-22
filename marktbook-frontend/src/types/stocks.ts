import { LocationTypes, Status } from './inv'

type mainOption =
    | 'Stocks'
    | 'Low Stocks'
    | 'Movements'
    | 'Adjustments'
    | 'Stocks By Supplier'
    | 'Locations'

type subOption =
    | 'None'

export interface stocksState {
    stocks: Stock[];
    error: string | null;
    success: string | null;
    loading: boolean;
    mainOpt: mainOption;
    subOpt: subOption;
    lowStocks: Stock[];
    bySupplier: Stock[];
    locations: Location[];
    movements: StockMovement[];
}

export interface Stock {
    compartment: string;
    unitsAvailable: number;
    maxQuantity: number;
    minQuantity: number;
    thresholdAlert: boolean;
    costPerUnit: number;
    totalValue: number;
    notes: string;
    updatedBy: { _id: string, name: string };
    lastRestocked: string;
    updatedAt: string;
    computedTotalValue: number;
    id: string;
    product: string;
    location: string;
    supplier: string | null;
}

export interface StockMovement {
    product: string;
    id: string;
    movementType: 'IN' | 'OUT';
    quantity: number;
    destination: string;
    initiatedBy: string;
    reason: string;
    timestamp: Date;
}

export interface Location {
    locationType: LocationTypes;
    stocksLength: number;
    locationName: string;
    address: string;
    currentLoad?: number;
    capacity: number;
    manager: string;
    locationStatus: Status;
    stockMovements: Array<StockMovement>
    updatedAt: string;
    id: string;
    businessId?: string
}