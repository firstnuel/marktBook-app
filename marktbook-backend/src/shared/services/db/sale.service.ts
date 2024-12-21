import { ISaleDocument } from '@transactions/interfaces/sales.interface'
import { SaleModel } from '@transactions/models/sales.schema'



class SaleService {
  public async newSale(saleData: ISaleDocument): Promise<void> {
    await SaleModel.create(saleData)
  }
}


export const saleService = new SaleService()