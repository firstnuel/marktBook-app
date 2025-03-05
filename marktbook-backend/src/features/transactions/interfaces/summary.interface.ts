import { IProductDocument, ProductCategory } from '@inventory/interfaces/products.interface'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'


export interface ISummaryDocument extends Document {
totalSales: number[]
lastTotalSales?: number[]
totalProductSales: number[]
lastTotalPdSales?: number[]
totalCustomers: number[]
lastTotalCustomers?: number[]
netProfit: number[]
lastNetProfit?: number[]
highestSellingProduct: {
    product: IProductDocument
    amountSold: number
    }[]
higestSellingCategories: {
    category: ProductCategory
    amountOfSales: number 
}[]
}


export interface FilterData {
    createdAt?: Date | string,
    businessId: string | ObjectId
    lastCreatedAt?: Date | string,
}