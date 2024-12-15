import { productService } from '@service/db/productService'
import HTTP_STATUS from 'http-status-codes'
import { Product } from '@inventory/controllers/products'
import { Response, Request, NextFunction } from 'express-serve-static-core'
import { Utils } from '@global/helpers/utils'
import { config } from '@root/config'


const log = config.createLogger('productMangementController')

class ProductManagement extends Product {
  public async fetch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      // validate user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      //sanitize params
      const sanitizedParams = Utils.sanitizeInput(req.params)
      const { productId } = sanitizedParams

      // fetch product
      const product = await productService.getById(`${productId}`, `${existingUser?.associatedBusinessesId}`)
      const message = product? 'Products data fetched successfully' : 'No product found'
      res.status(HTTP_STATUS.OK).json({ message, data: product })


    } catch(error) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching uses')
      next(error)
    }
  }

}




export const productManagement = new ProductManagement()