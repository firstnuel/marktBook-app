import { IProductJob } from '@inventory/interfaces/products.interface'
import { BaseQueue } from './base.queue'
import { productWorker } from '@worker/product.worker'



class ProductQueue extends BaseQueue {
  constructor() {
    super('product')
    this.processJob('addProductToDb', 5, productWorker.addProductJob)
  }

  public addProductJob(name: string, data: IProductJob): void {
    this.addJob(name, data)
  }
}


export const productQueue: ProductQueue = new ProductQueue()