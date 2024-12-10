/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { Register } from '@auth/controllers/register'
import { CustomError } from '@global/helpers/error-handlers'
import { authMockRequest, authMockResponse } from '@root/mocks/auth.mock'
import { authService } from '@service/db/auth.service'
import { userQueue } from '@service/queues/user.queue'
import { authQueue } from '@service/queues/auth.queue'
import { businessQueue } from '@service/queues/business.queue'
import { UserCache } from '@service/redis/user.cache'
import { BusinessCache } from '@service/redis/business.cache'
import { uploads } from '@global/helpers/cloudinary-upload'

jest.useFakeTimers()
jest.mock('@service/db/auth.service')
jest.mock('@service/redis/user.cache')
jest.mock('@service/redis/business.cache')
jest.mock('@service/queues/user.queue')
jest.mock('@service/queues/auth.queue')
jest.mock('@service/queues/business.queue')
jest.mock('@global/helpers/cloudinary-upload')

describe('Register Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should throw an error if email is not provided', () => {
    const req: Request = authMockRequest(
      {},
      { email: '', password: 'password123', businessName: 'Test Business' }
    ) as Request
    const res: Response = authMockResponse()

    Register.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toBe(400)
      expect(error.serializeErrors().message).toBe('Email is a required field')
    })
  })

  it('should throw an error if password is not provided', () => {
    const req: Request = authMockRequest(
      {},
      { email: 'test@example.com', password: '', businessName: 'Test Business' }
    ) as Request
    const res: Response = authMockResponse()

    Register.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toBe(400)
      expect(error.serializeErrors().message).toBe('Password is a required field')
    })
  })

  it('should throw an error if business name is not provided', () => {
    const req: Request = authMockRequest(
      {},
      { email: 'test@example.com', password: 'password123', businessName: '' }
    ) as Request
    const res: Response = authMockResponse()

    Register.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toBe(400)
      expect(error.serializeErrors().message).toBe('Business name is required')
    })
  })

  it('should throw an error if business already exists', () => {
    jest.spyOn(authService, 'getBusinessByNameAndEmail').mockResolvedValue({} as any)

    const req: Request = authMockRequest(
      {},
      {
        email: 'existing@example.com',
        password: 'password123',
        businessName: 'Existing Business'
      }
    ) as Request
    const res: Response = authMockResponse()

    Register.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toBe(400)
      expect(error.serializeErrors().message).toBe('Business with this name or email already exists.')
    })
  })

  it('should throw an error if business logo upload fails', () => {
    jest.spyOn(authService, 'getBusinessByNameAndEmail').mockResolvedValue(null)
    jest.spyOn(uploads, 'uploads').mockResolvedValue(null)

    const req: Request = authMockRequest(
      {},
      {
        email: 'test@example.com',
        password: 'password123',
        businessName: 'Test Business',
        businessLogo: 'invalidImage'
      }
    ) as Request
    const res: Response = authMockResponse()

    Register.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toBe(400)
      expect(error.serializeErrors().message).toBe('File Error: Failed to upload business logo. Please try again.')
    })
  })

  it('should handle unexpected errors gracefully', () => {
    jest.spyOn(authService, 'getBusinessByNameAndEmail').mockRejectedValue(new Error('Unexpected Error'))

    const req: Request = authMockRequest(
      {},
      {
        email: 'test@example.com',
        password: 'password123',
        businessName: 'Test Business',
        businessLogo: 'validImage'
      }
    ) as Request
    const res: Response = authMockResponse()

    Register.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toBe(500)
      expect(error.serializeErrors().message).toBe('Unexpected Error')
    })
  })

  it('should successfully register a business and user', async () => {
    jest.spyOn(authService, 'getBusinessByNameAndEmail').mockResolvedValue(null)
    jest.spyOn(uploads, 'uploads').mockResolvedValue({ public_id: 'test_public_id' })
    const userCacheSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache').mockResolvedValue(true as any)
    const businessCacheSpy = jest.spyOn(BusinessCache.prototype, 'saveBusinessToCache').mockResolvedValue(true as any)
    jest.spyOn(userQueue, 'addUserJob').mockResolvedValue(undefined)
    jest.spyOn(authQueue, 'addAuthUserJob').mockResolvedValue(undefined)
    jest.spyOn(businessQueue, 'addBusinessJob').mockResolvedValue(undefined)

    const req: Request = authMockRequest(
      {},
      {
        email: 'test@example.com',
        password: 'password123',
        businessName: 'Test Business',
        username: 'testuser',
        businessLogo: 'validImage',
        adminFullName: 'Admin User',
        businessAddress: '123 Test St',
        businessType: 'Retail',
        businessCategory: 'Electronics'
      }
    ) as Request
    const res: Response = authMockResponse()

    await Register.prototype.create(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ message: 'Business account and user created successfully' })
    expect(userCacheSpy).toHaveBeenCalled()
    expect(businessCacheSpy).toHaveBeenCalled()
    expect(authQueue.addAuthUserJob).toHaveBeenCalledWith('addAuthUserToDb', expect.any(Object))
    expect(userQueue.addUserJob).toHaveBeenCalledWith('addUserToDb', expect.any(Object))
    expect(businessQueue.addBusinessJob).toHaveBeenCalledWith('addBusinessToDb', expect.any(Object))
  })
})
