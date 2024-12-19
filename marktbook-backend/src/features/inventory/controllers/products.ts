/* eslint-disable @typescript-eslint/no-explicit-any */
import { businessCache } from '@service/redis/business.cache'
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import { ZodValidationError, BadRequestError, NotFoundError, NotAuthorizedError, ServerError } from '@root/shared/globals/helpers/error-handlers'
import { productSchema, categorySchema, searchSchema } from '@inventory/schemes/productValidation'
import { IProductDocument, IProductData, IFilterData } from '@inventory/interfaces/products.interface'
import { uploadProductImages } from '@root/shared/globals/helpers/cloudinary-upload'
import { productQueue } from '@service/queues/product.queue'
import { config } from '@root/config'
import { Utils } from '@root/shared/globals/helpers/utils'
import { userCache } from '@service/redis/user.cache'
import { userService } from '@service/db/user.service'
import { businessService } from '@service/db/business.service'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import { IBusinessDocument } from '@business/interfaces/business.interface'
import { productService } from '@service/db/product.service'
import { Schema } from 'zod'
import { createActivityLog, ActionType, EntityType } from '@activity/interfaces/logs.interfaces'
import { logService } from '@service/db/logs.service'

export const log = config.createLogger('productsController')

export class Product {
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
      this.validateInput(productSchema, req.body)

      // Validate user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      // Sanitize input
      const body = Utils.sanitizeInput(req.body) as IProductData

      // Validate product uniqueness by SKU
      await this.validateProduct(body.sku)

      // Validate business
      await this.validateBusiness(body.businessId as string, existingUser)

      // Generate unique identifier
      const productObjectId: ObjectId = new ObjectId()

      // Upload Product Images if provided
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

      // log update
      const logData = createActivityLog (
        existingUser._id, 
        existingUser.username, 
        existingUser.associatedBusinessesId, 
        'CREATE' as ActionType, 
        'PRODUCT' as EntityType,
        `${productObjectId}`,
        `Created product '${body.productName}'`)

      await logService.createLog(logData)

      res.status(HTTP_STATUS.CREATED).json({
        message: `Product '${body.productName}' created successfully`,
        data: productData,
        status: 'success'
      })


    } catch (error: any) {
      log.error(`Product creation failed: ${error.message}`)
      next(error)
    }
  }
  /**
       * Protected method to validate input
       * @param userId string
       * @returns IuserDocument
       */
  
  protected validateInput(schema: Schema, data: any): boolean  {
    const parsedDataOrError = Utils.schemaParser(schema, data)
    if (parsedDataOrError !== true) {
      log.warn('Validation failed:', parsedDataOrError.toString())
      throw new ZodValidationError(parsedDataOrError.toString())
    }
    return parsedDataOrError
  }

  /**
  * Protected method to validate user status
  * @param userId string
   * @returns IuserDocument
    */
  protected async validateUser(userId: string): Promise<IuserDocument> {
    const cachedUser = await userCache.getUserfromCache(userId) as IuserDocument
    const existingUser = cachedUser ? cachedUser : await userService.getUserById(userId) as IuserDocument

    if (!existingUser || existingUser.status !== 'active') {
      throw new NotAuthorizedError('Invalid User')
    }

    return existingUser
  }

  /**
     * Protected method to validate product uniqueness by SKU
     * @param sku string
     */
  protected async validateProduct(sku: string): Promise<void> {
    const checkIfProductExist: IProductDocument | null = await productService.getBySku(sku)
    if (checkIfProductExist) {
      log.warn(`Product creation failed: Product with unique sku "${sku}" already exists.`)
      throw new BadRequestError('Product with unique sku already exists.')
    }
  }

  /**
     * Protected method to validate business and user authorization for it.
     * @param businessId string
     * @param user IuserDocument
     * @returns IBusinessDocument
     */
  protected async validateBusiness(businessId: string, user: IuserDocument): Promise<IBusinessDocument> {
    const cachedBusiness = await businessCache.getBusinessFromCache(businessId) as IBusinessDocument
    const existingBusiness = cachedBusiness ? cachedBusiness :
            await businessService.getBusinessById(businessId) as IBusinessDocument

    if (!existingBusiness) {
      throw new NotFoundError('Invalid Business: business not found')
    } else if (existingBusiness._id.toString() !== user.associatedBusinessesId.toString()) {
      throw new NotAuthorizedError('Invalid Business: not authorized for this business')
    }

    return existingBusiness
  }

  /**
     * Constructs the product document for a new product.
     * @param data product data
     * @param productId ObjectId of the product
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
      productName: Utils.firstLetterToUpperCase(productName),
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
      isActive: isActive || false,
      supplierId: supplierId || null,
      createdBy: new ObjectId(userId),
      updatedBy: new ObjectId(userId),
    } as unknown as IProductDocument
  }

  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      // validate user 
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      // fetch products
      const products = await productService.fetchAll(`${existingUser.associatedBusinessesId}`)

      const message = products.length? 'Products data fetched successfully' : 'No product found'
      res.status(HTTP_STATUS.OK).json({ message, data: products })

    } catch(error) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching product')
      next(error)
    }
  }

  public async categories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      // validate params
      const parsedDataOrError = Utils.schemaParser(categorySchema, req.params) 
      if (parsedDataOrError !== true) {
        log.warn('Validation failed:', parsedDataOrError.toString())
        return next(new ZodValidationError(parsedDataOrError.toString()))
      }

      const reqQuery = Utils.sanitizeInput(req.params)
      const { category }  = reqQuery

      // fetch products
      const products = await productService.fetchCategories(`${existingUser.associatedBusinessesId}`, category)
      const message = products.length? 'Products data fetched successfully' : 'No product found'
      res.status(HTTP_STATUS.OK).json({ message, data: products })

    } catch(error) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching uses')
      next(error)
    }
  }

  /**
   * Handles searching for a product using fields  name, sku, barcode, tags
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */
  public async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      // validate params
      const parsedDataOrError = Utils.schemaParser(searchSchema, req.params) 
      if (parsedDataOrError !== true) {
        log.warn('Validation failed:', parsedDataOrError.toString())
        return next(new ZodValidationError(parsedDataOrError.toString()))
      }
  
      const query = Utils.sanitizeInput(req.query)
      const { name, sku, barcode, tags } =  query

      const filter: IFilterData = {
        businessId: `${existingUser.associatedBusinessesId}`,
      }
      if (name) filter.name = { $regex: name, $options: 'i'}
      if (sku) filter.sku = sku
      if (barcode) filter.barcode = barcode
      if (tags) filter.tags = { $in: tags.split() }

      // fetch data
      const products = await productService.fetchbyFilter(filter)
      const message = products.length? 'Products data fetched successfully' : 'No product found'
      res.status(HTTP_STATUS.OK).json({ message, data: products })

    } catch(error) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching uses')
      next(error)
    }
  }

}

export const product: Product = new Product()
