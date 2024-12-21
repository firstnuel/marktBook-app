/* eslint-disable @typescript-eslint/no-explicit-any */
import { productService } from '@service/db/product.service'
import HTTP_STATUS from 'http-status-codes'
import { Product } from '@inventory/controllers/products'
import { Response, Request, NextFunction } from 'express-serve-static-core'
import { Utils } from '@global/helpers/utils'
import { config } from '@root/config'
import { productSchema } from '@inventory/schemes/productValidation'
import { filterProductFields, 
  ALLOWED_ALL_FIELDS, 
  ALLOWED_STAFF_FIELDS } from '@inventory/interfaces/products.interface'
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handlers'
import { uploadProductImages } from '@global/helpers/cloudinary-upload'
import { ActionType, createActivityLog, EntityType } from '@activity/interfaces/logs.interfaces'
import { logService } from '@service/db/logs.service'
import { stockService } from '@service/db/stock.service'
import { ObjectId } from 'mongodb'
import { locationService } from '@service/db/location.service'


const log = config.createLogger('productMangementController')

class ProductManagement extends Product {
  constructor() {
    super()
    this.fetch = this.fetch.bind(this)
    this.editProduct = this.editProduct.bind(this)
    this.deleteProduct = this.deleteProduct.bind(this)

  }


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

      const { productId } = req.params

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

      const { productId } = req.params

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

      // Upload Product Images if provided
      if (filteredData.productImages){
        const result = await uploadProductImages(filteredData.productImages)
        if (result instanceof Error) {
          return next(new BadRequestError('File Error: Failed to upload product images. Please try again.'))
        } else {
          filteredData.productImages = result
        }
      }

      filteredData.updatedAt = new Date()
      filteredData.updatedBy = new ObjectId(existingUser._id)

      // Perform update
      const updatedProduct = await productService.editProduct(`${productId}`, filteredData)

      // log update
      const logData = createActivityLog (
        existingUser._id, 
        existingUser.username, 
        existingUser.associatedBusinessesId, 
        'EDIT' as ActionType, 
        'PRODUCT' as EntityType,
        `${productId}`,
        `Edited product '${updatedProduct?.productName}'`)

      await logService.createLog(logData)

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
      const { productId } = req.params

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

      // delete stock and location data
      await locationService.deleteLocation(new ObjectId(product.stockId))
      await stockService.deleteStock(new ObjectId(product.stockId))

      // Perform deletion
      await productService.deleteProductById(product!._id)

      // log update
      const logData = createActivityLog (
        existingUser._id, 
        existingUser.username, 
        existingUser.associatedBusinessesId, 
        'DELETE' as ActionType, 
        'PRODUCT' as EntityType,
        `${productId}`,
        `Deleted product '${product?.productName}'`)
      
      await logService.createLog(logData)

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