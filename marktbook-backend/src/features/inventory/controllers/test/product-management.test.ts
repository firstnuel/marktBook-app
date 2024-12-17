/* eslint-disable @typescript-eslint/no-explicit-any */
import { productManagement } from '@inventory/controllers/product-management'
import { productService } from '@service/db/productService'
import { userCache } from '@service/redis/user.cache'
import { Utils } from '@global/helpers/utils'
import HTTP_STATUS from 'http-status-codes'
import { 
  ZodValidationError, 
  NotAuthorizedError, 
  NotFoundError 
} from '@global/helpers/error-handlers'
import { productMockRequest, productMockResponse } from '@root/mocks/product.mock'
// import { filterProductFields, ALLOWED_ALL_FIELDS, ALLOWED_STAFF_FIELDS } from '@inventory/interfaces/products.interface'
import { Request, Response, NextFunction } from 'express'

jest.mock('@service/db/productService', () => ({
  productService: {
    getById: jest.fn(),
    editProduct: jest.fn(),
    deleteProductById: jest.fn(),
  },
}))

jest.mock('@service/redis/user.cache', () => ({
  userCache: {
    getUserfromCache: jest.fn(),
  },
}))

jest.mock('@global/helpers/utils', () => ({
  Utils: {
    sanitizeInput: jest.fn((val: any) => val),
    schemaParser: jest.fn(),
  },
}))

jest.mock('@inventory/interfaces/products.interface', () => {
  const originalModule = jest.requireActual('@inventory/interfaces/products.interface')
  return {
    ...originalModule,
    filterProductFields: jest.fn(),
  }
})

// import { filterProductFields as mockFilterProductFields } from '@inventory/interfaces/products.interface'

describe('ProductManagement Controller', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  const validUserId = '507f1f77bcf86cd799439011'
  const validBusinessId = '507f1f77bcf86cd799439012'
  const validProductId = '507f1f77bcf86cd799439013'

  beforeEach(() => {
    req = productMockRequest(
      { jwt: 'mocked-jwt' },
      {},
      {
        userId: validUserId,
        businessId: validBusinessId,
        uId: {
          userUId: '',
          businessUId: ''
        },
        email: '',
        username: ''
      },
      { productId: validProductId }
    ) as Request

    res = productMockResponse()
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('fetch', () => {
    it('should fetch product successfully', async () => {
      (userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        associatedBusinessesId: validBusinessId,
        status: 'active',
      });
      
      (productService.getById as jest.Mock).mockResolvedValue({
        _id: validProductId,
        name: 'Test Product',
      })

      await productManagement.fetch(req, res, next)

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Products data fetched successfully',
          data: { _id: validProductId, name: 'Test Product' },
        })
      )
    })

    it('should return "No product found" if none exist', async () => {
      (userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        associatedBusinessesId: validBusinessId,
        status: 'active',
      });
      
      (productService.getById as jest.Mock).mockResolvedValue(null)

      await productManagement.fetch(req, res, next)

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'No product found',
          data: null,
        })
      )
    })

    it('should call next with error if user validation fails', async () => {
      (userCache.getUserfromCache as jest.Mock).mockRejectedValue(new Error('User validation failed'))

      await productManagement.fetch(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('editProduct', () => {
    beforeEach(() => {
      req.body = {
        productName: 'Updated Product',
        basePrice: 150,
        businessId: validBusinessId,
      }
    })

    // it('should edit product successfully for Owner', async () => {
    //   (Utils.schemaParser as jest.Mock).mockReturnValue(true); // Pass validation
    //   (userCache.getUserfromCache as jest.Mock).mockResolvedValue({
    //     _id: validUserId,
    //     associatedBusinessesId: validBusinessId,
    //     role: 'Owner',
    //     status: 'active',
    //   });
    //   (productService.getById as jest.Mock).mockResolvedValue({ _id: validProductId });
    //   (productService.editProduct as jest.Mock).mockResolvedValue({
    //     _id: validProductId,
    //     ...req.body,
    //   })

    //   await productManagement.editProduct(req, res, next)

    //   expect(mockFilterProductFields).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       productName: 'Updated Product',
    //       basePrice: 150,
    //       businessId: validBusinessId
    //     }),
    //     ALLOWED_ALL_FIELDS
    //   )
    //   expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    //   expect(filterProductFields).toHaveBeenCalledWith(req.body)
    //   expect(res.json).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       status: 'success',
    //       message: 'Product updated successfully',
    //       data: expect.objectContaining({
    //         _id: validProductId,
    //       }),
    //     })
    //   )
    // })

    // it('should edit product successfully for Staff with limited fields', async () => {
    //   (Utils.schemaParser as jest.Mock).mockReturnValue(true);
    //   (userCache.getUserfromCache as jest.Mock).mockResolvedValue({
    //     _id: validUserId,
    //     associatedBusinessesId: validBusinessId,
    //     role: 'Staff',
    //     status: 'active',
    //   });
    //   (productService.getById as jest.Mock).mockResolvedValue({ _id: validProductId });
    //   (productService.editProduct as jest.Mock).mockResolvedValue({
    //     _id: validProductId,
    //     ...req.body,
    //   })

    //   await productManagement.editProduct(req, res, next)

    //   expect(mockFilterProductFields).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       productName: 'Updated Product',
    //       basePrice: 150,
    //       businessId: validBusinessId
    //     }),
    //     ALLOWED_STAFF_FIELDS
    //   )
    //   expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    //   expect(res.json).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       status: 'success',
    //       message: 'Product updated successfully',
    //     })
    //   )
    // })

    it('should throw validation error for invalid input', async () => {
      (Utils.schemaParser as jest.Mock).mockReturnValue('Validation failed')

      await productManagement.editProduct(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(ZodValidationError))
    })

    it('should throw NotFoundError if product does not exist', async () => {
      (Utils.schemaParser as jest.Mock).mockReturnValue(true);
      (userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        associatedBusinessesId: validBusinessId,
        role: 'Owner',
        status: 'active',
      });
      (productService.getById as jest.Mock).mockResolvedValue(null)

      await productManagement.editProduct(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    })
  })

  describe('deleteProduct', () => {
    it('should delete product successfully for Owner', async () => {
      (userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        associatedBusinessesId: validBusinessId,
        role: 'Owner',
        status: 'active',
      });
      (productService.getById as jest.Mock).mockResolvedValue({
        _id: validProductId,
        name: 'To Delete'
      })

      await productManagement.deleteProduct(req, res, next)

      expect(productService.deleteProductById).toHaveBeenCalledWith(validProductId)
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Product deleted successfully',
        })
      )
    })

    it('should delete product successfully for Manager', async () => {
      (userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        associatedBusinessesId: validBusinessId,
        role: 'Manager',
        status: 'active',
      });
      (productService.getById as jest.Mock).mockResolvedValue({
        _id: validProductId,
        name: 'To Delete'
      })

      await productManagement.deleteProduct(req, res, next)

      expect(productService.deleteProductById).toHaveBeenCalledWith(validProductId)
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Product deleted successfully',
        })
      )
    })

    it('should throw NotAuthorizedError for Staff', async () => {
      (userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        associatedBusinessesId: validBusinessId,
        role: 'Staff',
        status: 'active',
      })

      await productManagement.deleteProduct(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotAuthorizedError))
    })

    it('should throw NotFoundError if product not found', async () => {
      (userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        associatedBusinessesId: validBusinessId,
        role: 'Owner',
        status: 'active',
      });
      (productService.getById as jest.Mock).mockResolvedValue(null)

      await productManagement.deleteProduct(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    })
  })
})
