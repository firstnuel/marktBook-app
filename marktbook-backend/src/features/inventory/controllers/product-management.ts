/* eslint-disable @typescript-eslint/no-explicit-any */
import { productService } from '@service/db/productService'
import HTTP_STATUS from 'http-status-codes'
import { Product } from '@inventory/controllers/products'
import { Response, Request, NextFunction } from 'express-serve-static-core'
import { Utils } from '@global/helpers/utils'
import { config } from '@root/config'
import { productSchema } from '@inventory/schemes/productValidation'
import { filterProductFields, 
  ALLOWED_ALL_FIELDS, 
  ALLOWED_STAFF_FIELDS } from '@inventory/interfaces/products.interface'
import { NotAuthorizedError, NotFoundError } from '@global/helpers/error-handlers'


const log = config.createLogger('productMangementController')

class ProductManagement extends Product {
  /**
   * Handles fetching Product by Id     
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */
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

  /**
   * Handles editing product based on status and role
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */
  public async editProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{

      // Validate input
      this.validateInput(productSchema, req.body)

      // sanitize product ID
      const sanitizedParams = Utils.sanitizeInput(req.params)
      const { productId } = sanitizedParams

      // validate requesting user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      // Check if product exist
      const product = await productService.getById(`${productId}`, `${existingUser.associatedBusinessesId}`)
      if (!product) {
        return next(new NotFoundError('Product not found'))
      }

      // Extract and sanitize the input data
      const body = Utils.sanitizeInput(req.body)

      // validate business
      await this.validateBusiness(body.businessId as string, existingUser)

      const filterKeys = existingUser.role === 'Staff'? ALLOWED_STAFF_FIELDS : ALLOWED_ALL_FIELDS
      const filteredData = filterProductFields(body, filterKeys)

      filteredData.updatedAt = new Date()

      // Perform update
      const updatedProduct = await productService.editProduct(`${productId}`, filteredData)

      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Product updated successfully',
        data: updatedProduct,
      })
    } catch (error: any) {
      log.error(`Error updating user: ${error.message}`)
      next(error)
    }
  }

  public async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> { 
    try{
      // Sanitize product ID
      const sanitizedParams = Utils.sanitizeInput(req.params)
      const { productId } = sanitizedParams

      // Validate requesting user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)
      if (!(existingUser.role == 'Owner' || existingUser.role == 'Manager')) {
        return next(new NotAuthorizedError('Invalid User'))
      }
      
      // Check if product exist
      const product = await productService.getById(`${productId}`, `${existingUser.associatedBusinessesId}`)
      if (!product) {
        return next(new NotFoundError('Product not found'))
      }

      // Perform deletion
      await productService.deleteProductById(product!._id)

      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Product deleted successfully',
      })

    } catch (error: any) {
      log.error(`Error deleting product: ${error.message}`)
      next(error)
    }
  }

}




export const productManagement = new ProductManagement()