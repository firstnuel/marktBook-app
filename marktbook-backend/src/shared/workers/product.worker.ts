import { DoneCallback, Job } from 'bull'
import { config } from '@root/config'
import { productService } from '@service/db/product.service'

const log = config.createLogger('productWorker')


class ProductWorker {
  async addProductJob(job: Job, done: DoneCallback): Promise<void> {

    try {
      const { value } = job.data
      await productService.createProduct(value)
      job.progress(100)
      done(null, job.data)

    } catch(error) {
      log.error(error)
      done(error as Error)
    }
  }
}

export const productWorker: ProductWorker = new ProductWorker()