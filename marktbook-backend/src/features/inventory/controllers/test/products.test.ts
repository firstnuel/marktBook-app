import { product } from '@inventory/controllers/products'
import { Request, Response, NextFunction } from 'express'
import { userCache } from '@service/redis/user.cache'
import { businessCache } from '@service/redis/business.cache'
import { productQueue } from '@service/queues/product.queue'
import { productService } from '@service/db/product.service'
import { businessService } from '@service/db/business.service'
import { Utils } from '@global/helpers/utils'
import { productMockRequest, productMockResponse } from '@root/mocks/product.mock'
import HTTP_STATUS from 'http-status-codes'
import { ZodValidationError, BadRequestError, NotAuthorizedError, NotFoundError, ServerError } from '@global/helpers/error-handlers'
import { productSchema } from '@inventory/schemes/productValidation'
import { IProductData } from '@inventory/interfaces/products.interface'

jest.mock('@service/redis/user.cache', () => ({
  userCache: {
    getUserfromCache: jest.fn(),
  },
}))

jest.mock('@service/redis/business.cache', () => ({
  businessCache: {
    getBusinessFromCache: jest.fn(),
  },
}))

jest.mock('@service/queues/product.queue', () => ({
  productQueue: {
    addProductJob: jest.fn(),
  },
}))

jest.mock('@service/db/productService', () => ({
  productService: {
    getBySku: jest.fn(),
  },
}))

jest.mock('@service/db/user.service', () => ({
  userService: {
    getUserById: jest.fn(),
  },
}))

jest.mock('@service/db/business.service', () => ({
  businessService: {
    getBusinessById: jest.fn(),
  },
}))

describe('Product Controller - Create', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  const validBusinessId = '507f1f77bcf86cd799439012' // valid 24-char hex ObjectId
  const userId = '507f1f77bcf86cd799439011'      // valid ObjectId for user
  const associatedBusinessId = '507f1f77bcf86cd799439012' // matches the business

  beforeEach(() => {
    req = productMockRequest(
      { jwt: 'mocked-jwt' },
      {
        sku: 'product-sku-123',
        productName: 'Sample Product',
        businessId: validBusinessId, 
        basePrice: 100,
        unit: 'kg',
      } as IProductData,
      {
        userId,
        businessId: validBusinessId,
        uId: {
          userUId: '',
          businessUId: ''
        },
        email: '',
        username: ''
      }
    ) as Request
    res = productMockResponse()
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should create a product successfully', async () => {
    // Mock utils
    const schemaParserSpy = jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    const sanitizeInputSpy = jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)
    const firstLetterToUpperCaseSpy = jest
      .spyOn(Utils, 'firstLetterToUpperCase')
      .mockImplementation((str: string) => str)

    // Mocks for successful scenario
    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({ 
      _id: userId, 
      associatedBusinessesId: associatedBusinessId, 
      status: 'active' 
    })
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue({ 
      _id: associatedBusinessId 
    })
    ;(productService.getBySku as jest.Mock).mockResolvedValue(null)

    await product.create(req, res, next)

    expect(schemaParserSpy).toHaveBeenCalledWith(productSchema, req.body)
    expect(sanitizeInputSpy).toHaveBeenCalledWith(req.body)
    expect(productQueue.addProductJob).toHaveBeenCalledWith('addProductToDb', expect.anything())
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Product \'Sample Product\' created successfully',
        status: 'success',
      })
    )

    schemaParserSpy.mockRestore()
    sanitizeInputSpy.mockRestore()
    firstLetterToUpperCaseSpy.mockRestore()
  })

  it('should throw validation error for invalid product data', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue('Validation failed')

    await product.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ZodValidationError))
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Validation failed' }))
  })

  it('should throw error if SKU already exists', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)
    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({ 
      _id: userId, 
      associatedBusinessesId: associatedBusinessId, 
      status: 'active' 
    })
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue({ _id: associatedBusinessId })
    ;(productService.getBySku as jest.Mock).mockResolvedValue({ _id: 'someProductId' })

    await product.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Product with unique sku already exists.' }))
  })

  it('should throw error if business is invalid', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)
    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({ 
      _id: userId, 
      associatedBusinessesId: associatedBusinessId, 
      status: 'active' 
    })
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue(null)
    ;(businessService.getBusinessById as jest.Mock).mockResolvedValue(null)
    ;(productService.getBySku as jest.Mock).mockResolvedValue(null) // ensure not failing on SKU

    await product.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid Business: business not found' }))
  })

  it('should throw error if user is not authorized for the business', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)
    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({ 
      _id: userId, 
      // Different associated business than the one in req
      associatedBusinessesId: '507f1f77bcf86cd799439099', 
      status: 'active' 
    })
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue({ _id: associatedBusinessId })
    ;(productService.getBySku as jest.Mock).mockResolvedValue(null) // ensure not failing on SKU

    await product.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(NotAuthorizedError))
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid Business: not authorized for this business' }))
  })

  it('should handle queue failure gracefully', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)
    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({ 
      _id: userId, 
      associatedBusinessesId: associatedBusinessId, 
      status: 'active' 
    })
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue({ _id: associatedBusinessId })
    ;(productService.getBySku as jest.Mock).mockResolvedValue(null)
    ;(productQueue.addProductJob as jest.Mock).mockImplementation(() => {
      throw new Error('Queue failure')
    })

    await product.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ServerError))
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to process product creation. Please try again.' }))
  })
})
