import { Product, ProductCategory } from './pos'


export type QueryPeriod =
    | 'yearly'
    | 'monthly'
    | 'weekly'
    | 'daily'


export interface dashboardState {
    data: Summary | null
    period: QueryPeriod
    error: string | null,
    success: string | null,
    loading: boolean,
}



export interface Summary {
  totalSales: number[]
  lastTotalSales?: number[]
  totalProductSales: number[]
  lastTotalPdSales?: number[]
  totalCustomers: number[]
  lastTotalCustomers?: number[]
  netProfit: number[]
  lastNetProfit?: number[]
  highestSellingProduct: {
      product: Product
      amountSold: number
      }[]
  higestSellingCategories: {
      category: ProductCategory
      amountOfSales: number
  }[]
  }
