import { IProductDocument } from '@inventory/interfaces/products.interface'
import { ProductModel } from '@inventory/models/products.schema'


class ProductService {

  public async createProduct(data: IProductDocument): Promise<void> {
    await ProductModel.create(data)
  }

  public async getBySku(sku: string): Promise<IProductDocument | null> {
    const result = await ProductModel.findOne({ sku }).exec() as IProductDocument
    return result || null
  }


}


export const productService: ProductService = new ProductService()