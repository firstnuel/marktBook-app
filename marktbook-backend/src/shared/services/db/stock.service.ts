import { StockModel } from '@inventory/models/stocks.schema'
import { IStockDocument } from '@inventory/interfaces/stock.interfaces'
import { ObjectId } from 'mongodb'

class StockService {
  public async createStock(data: IStockDocument): Promise<void> {
    await StockModel.create(data)
  }

  public async getByProductID(productId: string | ObjectId): Promise<IStockDocument | null> {
    const result =  await StockModel.findOne({ productId: new ObjectId(productId) }).exec()
    return result 
  }

}

export const stockService = new StockService()