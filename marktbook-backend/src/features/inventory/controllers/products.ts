/* eslint-disable @typescript-eslint/no-explicit-any */
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import { ZodValidationError, BadRequestError, ServerError } from '@root/shared/globals/helpers/error-handlers'
import { productSchema, categorySchema, searchSchema } from '@inventory/schemes/productValidation'
import { IProductDocument, IProductData, IFilterData } from '@inventory/interfaces/products.interface'
import { singleImageUpload } from '@root/shared/globals/helpers/cloudinary-upload'
import { productQueue } from '@service/queues/product.queue'
import { config } from '@root/config'
import { Utils } from '@root/shared/globals/helpers/utils'
import { productService } from '@service/db/product.service'
import { Schema } from 'zod'
import { omit } from 'lodash'
import { createActivityLog, ActionType, EntityType } from '@activity/interfaces/logs.interfaces'
import { logService } from '@service/db/logs.service'

export const log = config.createLogger('productsController')

export class Product {
  constructor() {
    this.create = this.create.bind(this)
    this.read = this.read.bind(this)
    this.categories = this.categories.bind(this)
    this.search = this.search.bind(this)
    this.batch =     this.batch.bind(this)
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
      const existingUser = req.user!
      const body = Utils.sanitizeInput(req.body) as IProductData
      const productObjectId: ObjectId = new ObjectId()

      // Upload Product Images if provided
      if (body.productImage && !body.productImage.startsWith('https')) {
        const result = await singleImageUpload(body.productImage, productObjectId.toString())
        if (!result) {
          return next(new BadRequestError('File Error: Failed to upload product image. Please try again.'))
        } else {
          body.productImage = result
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
     * Protected method to validate product uniqueness by SKU
     * @param sku string
     */
  protected generateSku(productName: string): string {
    const timestamp = Date.now().toString(36)
    const randomSegment = Math.random().toString(36).substring(2, 6) // Random 4-character string
    const nameSegment = productName.substring(0, 3).toUpperCase()

  
    return `${nameSegment}${timestamp}${randomSegment}`.toUpperCase()
  }
  
  /**
     * Constructs the product document for a new product.
     * @param data product data
     * @param productId ObjectId of the product
     * @param userId ObjectId of the user
     * @returns product document conforming to IProductDocument interface
     */
  private productData(data: IProductData, productId: ObjectId, userId: ObjectId | string): IProductDocument {
    return {
      _id: productId,
      stockId: null,
      sku: this.generateSku(data.productName),
      currency: data.currency,
      productName: Utils.firstLetterToUpperCase(data.productName),
      businessId: new ObjectId(data.businessId),
      attributes: data.attributes,
      longDescription: data.longDescription ?? null,
      shortDescription: data.shortDescription ?? null,
      productCategory: data.productCategory,
      productImage: data.productImage,
      productType: data.productType,
      barcode: data.barcode ?? null,
      productVariants: data.productVariants ?? [],
      basePrice: data.basePrice,
      salePrice: data.salePrice ?? 0,
      unit: data.unit,
      tags: data.tags ?? [],
      discount: data.discount ?? 0,
      isActive: data.isActive ?? false,
      supplierId: data.supplierId ?? null,
      createdBy: new ObjectId(userId),
      updatedBy: new ObjectId(userId),
    } as unknown as IProductDocument
  }
  
  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      // validate user 
      const existingUser = req.user!

      // fetch products
      const products = await productService.fetchAll(`${existingUser.associatedBusinessesId}`)
      let transformedProducts
      if (products) {
        transformedProducts = products.map((product) => {
          const productData = product.toJSON()
          // Rename stockId to stock
          if (productData.stockId) {
            productData.stock = productData.stockId 
            delete productData.stockId 
          } else {
            productData.stock = null
            delete productData.stockId 
          }
      
          // Omit unnecessary fields
          return omit(productData, [
            'isActive',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt',
            '__v',
          ])
        })
      }
      

      const message = products.length? 'Products data fetched successfully' : 'No product found'
      res.status(HTTP_STATUS.OK).json({ message, data: transformedProducts })

    } catch(error) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching product')
      next(error)
    }
  }

  public async categories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate user
      const existingUser = req.user!
      req.params.category = Utils.firstLetterToUpperCase(req.params.category)

      // validate params
      this.validateInput(categorySchema, req.params)

      const { category } = req.params
      // fetch products
      const products = await productService.fetchCategories(`${existingUser.associatedBusinessesId}`, category)
      let transformedProducts
      if (products) {
        transformedProducts = products.map((product) => {
          const productData = product.toJSON()
          // Rename stockId to stock
          if (productData.stockId) {
            productData.stock = productData.stockId 
            delete productData.stockId 
          } else {
            productData.stock = null
            delete productData.stockId 
          }
      
          // Omit unnecessary fields
          return omit(productData, [
            'isActive',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt',
            '__v',
          ])
        })
      }
      
      const message = products.length? `Products data for '${category}' fetched successfully` : 'No product found'
      res.status(HTTP_STATUS.OK).json({ message, data: transformedProducts })

    } catch(error) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching Products data')
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
      const existingUser = req.user!

      // validate params
      this.validateInput(searchSchema, req.params)
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

  /**
 * Handles batch creation of products.
 * @param req Express Request object
 * @param res Express Response object
 * @param next Express NextFunction for error handling
 */
  public async batch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      log.info('Batch product creation attempt initiated.')

      // Validate incoming data
      if (!Array.isArray(req.body) || req.body.length === 0) {
        throw new BadRequestError('Invalid input: An array of products is required.')
      }
      req.body.forEach((product) => this.validateInput(productSchema, product))

      // Validate user
      const existingUser = req.user!

      // Sanitize input
      const sanitizedProducts = req.body.map((product) => Utils.sanitizeInput(product))

      // Generate product data and queue jobs
      const productDataArray = sanitizedProducts.map((product) => {
        const productObjectId = new ObjectId()
        if (product.productImage && !product.productImage.startsWith('https')) {
          product.productImage = singleImageUpload(product.productImage, productObjectId.toString())
        }
        return this.productData(product, productObjectId, existingUser._id)
      })

      // Add jobs to the queue
      productDataArray.forEach((productData) => {
        productQueue.addProductJob('addProductToDb', { value: productData })
      })

      // Log the batch creation
      const logData = createActivityLog(
        existingUser._id,
        existingUser.username,
        existingUser.associatedBusinessesId,
      'BATCH_CREATE' as ActionType,
      'PRODUCT' as EntityType,
      `Batch creation of ${productDataArray.length} products`,
      `Created ${productDataArray.length} products`
      )
      await logService.createLog(logData)

      res.status(HTTP_STATUS.CREATED).json({
        message: `Batch creation of ${productDataArray.length} products was successful.`,
        status: 'success',
      })
    } catch (error: any) {
      log.error(`Batch product creation failed: ${error.message}`)
      next(error)
    }
  }


}

export const product: Product = new Product()
