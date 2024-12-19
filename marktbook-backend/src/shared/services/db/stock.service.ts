import { StockModel } from '@inventory/models/stocks.schema'
import { IStockDocument } from '@inventory/interfaces/stock.interfaces'
import { ObjectId } from 'mongodb'

class StockService {
  public async createStock(data: IStockDocument): Promise<void> {
    await StockModel.create(data)
  }

  public async fetchAll(id: string | ObjectId): Promise<IStockDocument[] | []> {
    const result =  await StockModel.find({ businessId: id }).exec()
    return result
  }

  public async getByProductID(productId: string | ObjectId): Promise<IStockDocument | null> {
    const result =  await StockModel.findOne({ productId: new ObjectId(productId) }).populate({
      path: 'locationId',
      select: 'locationName address compartment locationType'
    }).exec()
    return result 
  }

  public async deleteStock(_id: ObjectId): Promise<void> {
    await StockModel.deleteOne({ _id }).exec()
  }

  public async editStock(Id: ObjectId, data: Partial<IStockDocument>): Promise<IStockDocument | null> {
    return StockModel.findByIdAndUpdate(Id, data, { new: true })
  }

}

export const stockService = new StockService()