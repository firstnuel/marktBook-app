type MainOption =
    | 'Inventory'
    | 'Stock'
    | 'Users'
    | 'Transactions'
    | 'Contacts'
    | 'Business'

export interface LogsState {
    mainOpt: MainOption
    inventory: Array<Log>
    stock: Array<Log>
    users: Array<Log>
    transaction: Array<Log>
    contacts: Array<Log>
    business: Array<Log>
    error: string | null
    loading: boolean
    success: string | null
}


export interface Log {
    username: string;
    action: ActionType;
    entity: EntityType;
    description: string;
    timestamp: Date;
}


// Enum for user actions that trigger an activity log
export enum ActionType {
    EDIT = 'EDIT',
    CREATE = 'CREATE',
    DELETE = 'DELETE',
    SALE = 'SALE',
    MOVE = 'MOVE',
    UPDATE = 'UPDATE',
    REFUND = 'REFUND'
}

// Enum for entity types that can be affected by actions
export enum EntityType {
    PRODUCT = 'PRODUCT',
    SALE = 'SALE',
    STOCK = 'STOCK',
    LOCATION = 'LOCATION',
    TRANSACTION = 'TRANSACTION',
    USER = 'USER',
    BUSINESS = 'BUSINESS',
    AUTH = 'AUTH',
    SUPPLIER  = 'SUPPLIER',
    CUSTOMER = 'CUSTOMER'
}
