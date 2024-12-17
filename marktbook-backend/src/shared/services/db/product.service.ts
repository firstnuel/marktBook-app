import { IFilterData, IProductDocument } from '@inventory/interfaces/products.interface'
import { ProductModel } from '@inventory/models/products.schema'
import { ObjectId } from 'mongodb'


class ProductService {

  public async createProduct(data: IProductDocument): Promise<void> {
    await ProductModel.create(data)
  }

  public async getBySku(sku: string): Promise<IProductDocument | null> {
    const result = await ProductModel.findOne({ sku }).exec() as IProductDocument
    return result || null
  }

  public async fetchAll(id: string | ObjectId): Promise<IProductDocument[] | []> {
    const result =  await ProductModel.find({ businessId: id }).exec()
    return result
  }

  public async fetchCategories(id: string | ObjectId, productCategory: string): Promise<IProductDocument[] | []> {
    const result =  await ProductModel.find({ productCategory,  businessId: id }).exec()
    return result
  }

  public async fetchbyFilter(filterData: IFilterData): Promise<IProductDocument[] | []> {
    const result = await ProductModel.find(filterData)
    return result
  }

  public async getById(productId: string, businessId: string):  Promise<IProductDocument | null> {
    const result = await ProductModel.findOne({  _id: new ObjectId(productId), businessId })
    return result || null
  }

  public async editProduct(productId: string, data: Partial<IProductDocument>):  Promise<IProductDocument | null> {
    return ProductModel.findByIdAndUpdate(new ObjectId(productId), data, { new: true }).exec()
  }

  public async editStockId(productId: string, stockId: ObjectId): Promise<void> {
    await ProductModel.findByIdAndUpdate(new ObjectId(productId), stockId).exec()
  }

  public async deleteProductById(productId: string | ObjectId): Promise<void> {
    await ProductModel.findByIdAndDelete(productId).exec()
  }


}


export const productService: ProductService = new ProductService()