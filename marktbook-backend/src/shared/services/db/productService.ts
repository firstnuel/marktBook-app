import { IProductDocument } from '@inventory/interfaces/products.interface'
import { ProductModel } from '@inventory/models/products.schema'


class ProductService {

    public async createProduct(data: IProductDocument): Promise<void> {
        await ProductModel.create(data)
    }


}


export const productService: ProductService = new ProductService()