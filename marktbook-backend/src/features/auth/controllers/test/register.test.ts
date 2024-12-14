import { Request, Response } from 'express'
import { register } from '@auth/controllers/register'
import { CustomError } from '@global/helpers/error-handlers'
import { authMockRequest, authMockResponse, IAuthMock } from '@root/mocks/auth.mock'
import { BusinessCategory, BusinessType } from '@auth/interfaces/auth.interface'
import { authService } from '@service/db/auth.service'
import { uploads, constructCloudinaryURL } from '@root/shared/globals/helpers/cloudinary-upload'
import { userCache } from '@service/redis/user.cache'
import { businessCache } from '@service/redis/business.cache'
import { authQueue } from '@service/queues/auth.queue'
import { userQueue } from '@service/queues/user.queue'
import { businessQueue } from '@service/queues/business.queue'

// Provide manual mock implementations
jest.mock('@service/db/auth.service', () => ({
  authService: {
    getBusinessByNameAndEmail: jest.fn(),
  },
}))

jest.mock('@root/shared/globals/helpers/cloudinary-upload', () => ({
  uploads: jest.fn(),
  constructCloudinaryURL: jest.fn(),
}))

jest.mock('@service/redis/user.cache', () => ({
  userCache: {
    saveUserToCache: jest.fn(),
  },
}))

jest.mock('@service/redis/business.cache', () => ({
  businessCache: {
    saveBusinessToCache: jest.fn(),
  },
}))

jest.mock('@service/queues/auth.queue', () => ({
  authQueue: {
    addAuthUserJob: jest.fn(),
  },
}))

jest.mock('@service/queues/user.queue', () => ({
  userQueue: {
    addUserJob: jest.fn(),
  },
}))

jest.mock('@service/queues/business.queue', () => ({
  businessQueue: {
    addBusinessJob: jest.fn(),
  },
}))

jest.useFakeTimers()

describe('Register Controller', () => {
  const validMockData: IAuthMock = {
    _id: '60263f14648fed5246e322d3',
    uIds: { userUId: '1621613119252066', businessUId: '1621614119252766' },
    username: 'MannyCorp',
    adminFullName: 'Manny David',
    businessName: 'Tech Innovations LLC',
    email: 'manny@me.com',
    password: 'Password123!',
    createdAt: '2022-08-31T07:42:24.451Z',
    businessType: 'Retail' as BusinessType,
    businessCategory: 'Technology' as BusinessCategory,
    businessLogo: 'data:image/png;base64,validBase64Image'
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  describe('Validation Failures', () => {
    it('should throw an error if email is invalid', async () => {
      const req: Request = authMockRequest({}, { ...validMockData, email: 'invalid-email' }) as Request
      const res: Response = authMockResponse()
      const next = jest.fn()

      await register.create(req, res, next).catch((error: CustomError) => {
        expect(error.statusCode).toEqual(400)
        expect(error.serializeErrors().message).toContain('Invalid email')
      })
    })

    it('should throw an error if password is too weak', async () => {
      const req: Request = authMockRequest({}, { ...validMockData, password: 'weak' }) as Request
      const res: Response = authMockResponse()
      const next = jest.fn()

      await register.create(req, res, next).catch((error: CustomError) => {
        expect(error.statusCode).toEqual(400)
        expect(error.serializeErrors().message).toContain('Password too weak')
      })
    })
  })

  describe('Business Existence Checks', () => {
    it('should prevent registration of an existing business', async () => {
      (authService.getBusinessByNameAndEmail as jest.Mock).mockResolvedValue({
        businessName: validMockData.businessName,
        email: validMockData.email
      })

      const req: Request = authMockRequest({}, validMockData) as Request
      const res: Response = authMockResponse()
      const next = jest.fn()

      await register.create(req, res, next).catch((error: CustomError) => {
        expect(error.statusCode).toEqual(400)
        expect(error.serializeErrors().message).toEqual('Business with this name or email already exists.')
      })
    })
  })

  describe('Successful Registration', () => {
    it('should successfully register a new business', async () => {
      // Mock dependencies to simulate successful registration
      (authService.getBusinessByNameAndEmail as jest.Mock).mockResolvedValue(null);
      (uploads as jest.Mock).mockResolvedValue({
        public_id: 'test-logo-id',
        url: 'https://cloudinary.com/test-logo'
      });
      (constructCloudinaryURL as jest.Mock).mockReturnValue('https://cloudinary.com/test-logo');
      (userCache.saveUserToCache as jest.Mock).mockResolvedValue(true);
      (businessCache.saveBusinessToCache as jest.Mock).mockResolvedValue(true);
      (authQueue.addAuthUserJob as jest.Mock).mockResolvedValue(true);
      (userQueue.addUserJob as jest.Mock).mockResolvedValue(true);
      (businessQueue.addBusinessJob as jest.Mock).mockResolvedValue(true)

      const req: Request = authMockRequest({}, validMockData) as Request
      const res: Response = authMockResponse()
      const next = jest.fn()

      await register.create(req, res, next)

      // Verify response
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Business account and user created successfully',
          data: expect.any(Object),
          token: expect.any(String)
        })
      )

      // Verify cache and queue methods were called
      expect(userCache.saveUserToCache).toHaveBeenCalled()
      expect(businessCache.saveBusinessToCache).toHaveBeenCalled()
      expect(authQueue.addAuthUserJob).toHaveBeenCalled()
      expect(userQueue.addUserJob).toHaveBeenCalled()
      expect(businessQueue.addBusinessJob).toHaveBeenCalled()
    })
  })

  describe('File Upload Scenarios', () => {
    it('should handle invalid business logo gracefully', async () => {
      const req: Request = authMockRequest({}, { ...validMockData, businessLogo: 'invalid-image-data' }) as Request
      const res: Response = authMockResponse()
      const next = jest.fn()

      await register.create(req, res, next).catch((error: CustomError) => {
        expect(error.statusCode).toEqual(400)
        expect(error.serializeErrors().message).toEqual('Invalid business logo. Please upload a valid image file.')
      })
    })

    it('should handle cloudinary upload failure', async () => {
      (authService.getBusinessByNameAndEmail as jest.Mock).mockResolvedValue(null);
      (uploads as jest.Mock).mockResolvedValue(null)

      const req: Request = authMockRequest({}, validMockData) as Request
      const res: Response = authMockResponse()
      const next = jest.fn()

      await register.create(req, res, next).catch((error: CustomError) => {
        expect(error.statusCode).toEqual(400)
        expect(error.serializeErrors().message).toEqual('File Error: Failed to upload business logo. Please try again.')
      })
    })
  })
})
