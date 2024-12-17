import { StockModel } from '@inventory/models/stocks.schema'
import { IStockDocument } from '@inventory/interfaces/stock.interfaces'
// import { ObjectId } from 'mongodb'

class StockService {
  public async createStock(data: IStockDocument): Promise<void> {
    await StockModel.create(data)
  }

}

export const stockService = new StockService()