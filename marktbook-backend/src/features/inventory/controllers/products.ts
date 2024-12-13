import { businessCache } from '@service/redis/business.cache'
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import { ZodValidationError, BadRequestError, NotFoundError, NotAuthorizedError, ServerError } from '@root/shared/globals/helpers/error-handlers'
import { productSchema } from '@inventory/schemes/productValidation'
import { IProductDocument, IProductData } from '@inventory/interfaces/products.interface'
import { uploadProductImages } from '@root/shared/globals/helpers/cloudinary-upload'
import { productQueue } from '@service/queues/product.queue'
import { config } from '@root/config'
import { Utils } from '@root/shared/globals/helpers/utils'
import { userCache } from '@service/redis/user.cache'
import { userService } from '@service/db/user.service'
import { businessService } from '@service/db/business.service'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import { IBusinessDocument } from '@business/interfaces/business.interface'


const log  = config.createLogger('productsController')


class Product {

    constructor() {
        this.create = this.create.bind(this)
    }

   /**
   * Handles the creating of a new product.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */

   public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info('Product creation attempt implemented')

        // validate incoming data
        const parsedDataOrError = Utils.schemaParser(productSchema, req.body)
        if (parsedDataOrError !== true) {
            log.warn('Validation failed:', parsedDataOrError.toString())
            return next(new ZodValidationError(parsedDataOrError.toString()))
        }
        // validate user
        const cachedUser = await userCache.getUserfromCache(`${req.currentUser?.userId}`) as IuserDocument
        const existingUser = cachedUser? cachedUser 
        : await userService.getUserById(`${req.currentUser?.userId}`) as IuserDocument

        if(existingUser?.status !== 'active') {
            return next(new NotAuthorizedError('Invalid User') )
            
        }
       // sanitize input
       const body = Utils.sanitizeInput(req.body) as IProductData

       // validate business
       const cachedBusiness = await businessCache.getBusinessFromCache(`${body.businessId}`) as IBusinessDocument
       const existingBusiness = cachedBusiness? cachedBusiness
       : await businessService.getBusinessById(`${body.businessId}`) as IBusinessDocument

       if(!existingBusiness) {
            return next(new NotFoundError('Invalid Business: business not found') )
       } else if (existingBusiness._id.toString() !== existingUser.associatedBusinessesId.toString()) {
            return next(new NotAuthorizedError('Invalid Business: not authorized for this business') )
       }

      // Generate unique identifiers
      const productObjectId: ObjectId = new ObjectId()

      if (body.productImages) {
        const result = await uploadProductImages(body.productImages)
        if (result instanceof Error) {
            return next(new BadRequestError('File Error: Failed to upload product images. Please try again.'))
          } else {
            body.productImages = result
          }
      }

      const productData: IProductDocument = this.productData(body, productObjectId, existingUser._id)


      // Add jobs to queues
      try {
        productQueue.addProductJob('addProductToDb', { value: productData })
        log.info(`Added job to queue for productId: ${productObjectId}`)
      } catch (queueError) {
        log.error(`Failed to add jobs to queues: ${(queueError as Error).message}`)
        return next(new ServerError('Failed to process product creation. Please try again.'))
      }

      res.status(HTTP_STATUS.CREATED).json({
        message: `Product '${productData.productName}' created successfully`,
        data: productData,
        status: 'success'
      })
 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      log.error(`Product creation failed: ${error.message}`)
      next(error)
    }

   }



  /**
   * Constructs the product document for a new product.
   * @param data product data
   * @param productObjectId ObjectId of the product
   * @param userId ObjectId of the user
   * @returns product document conforming to IProductDocument interface
   */

  private productData(data: IProductData, productId: ObjectId, userId: ObjectId | string): IProductDocument {
    const {
        sku,
        productName,
        currency,
        businessId,
        longDescription,
        shortDescription,
        productCategory,
        productType,
        barcode,
        productVariants,
        basePrice,
        salePrice,
        discount,
        unit,
        tags,
        supplierId,
        productImages,
        isActive
    } = data

    return {
        _id: productId,
        stockId: null,
        sku,
        currency,
        productName,
        businessId: new ObjectId(businessId),
        longDescription: longDescription || null,
        shortDescription: shortDescription || null,
        productCategory,
        productImages: productImages || [],
        productType,
        barcode: barcode || null,
        productVariants: productVariants || [],
        basePrice,
        salePrice: salePrice ?? 0,
        unit,
        tags: tags || [],
        discount: discount ?? 0,
        isActive:  isActive || false,
        supplierId: supplierId || null,
        createdBy: new ObjectId(userId),
        updatedBy: new ObjectId(userId),
    } as unknown as IProductDocument
  }

}


export const product: Product = new Product()