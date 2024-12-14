import { users } from '@users/controllers/users'
import { Request, Response, NextFunction } from 'express'
import { userMockRequest, userMockResponse } from '@root/mocks/user.mock'
import { userService } from '@service/db/user.service'
import { userCache } from '@service/redis/user.cache'
import { businessCache } from '@service/redis/business.cache'
import { businessService } from '@service/db/business.service'
import { authService } from '@service/db/auth.service'
import { authQueue } from '@service/queues/auth.queue'
import { userQueue } from '@service/queues/user.queue'
import { businessQueue } from '@service/queues/business.queue'
import { Utils } from '@global/helpers/utils'
import { ZodValidationError, BadRequestError, NotAuthorizedError, NotFoundError, ServerError } from '@global/helpers/error-handlers'
import { IuserData } from '@users/interfaces/user.interface'
import HTTP_STATUS from 'http-status-codes'

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

jest.mock('@service/db/user.service', () => ({
  userService: {
    getUserByUsernameAndEmail: jest.fn(),
    getUserById: jest.fn(),
    getAllUsers: jest.fn(),
  }
}))

jest.mock('@service/db/auth.service', () => ({
  authService: {
    getUserByEmailOrUsername: jest.fn(),
  }
}))

jest.mock('@service/db/business.service', () => ({
  businessService: {
    getBusinessById: jest.fn(),
  }
}))

jest.mock('@service/queues/auth.queue', () => ({
  authQueue: {
    addAuthUserJob: jest.fn(),
  }
}))

jest.mock('@service/queues/user.queue', () => ({
  userQueue: {
    addUserJob: jest.fn(),
  }
}))

jest.mock('@service/queues/business.queue', () => ({
  businessQueue: {
    updateBusisnessJob: jest.fn(),
  }
}))

describe('User Controller - Create', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  const validUserId = '507f1f77bcf86cd799439011'
  const associatedBusinessId = '507f1f77bcf86cd799439012'

  beforeEach(() => {
    req = userMockRequest(
      { jwt: 'mocked-jwt' },
      {
        email: 'newuser@example.com',
        username: 'newusername',
        mobileNumber: '1234567890',
        name: 'New User',
        role: 'Staff',
        status: 'active',
        address: '123 Test St',
        nin: '123456789',
        businessId: associatedBusinessId
      } as IuserData,
      {
        userId: validUserId,
        businessId: '',
        uId: {
          userUId: '',
          businessUId: ''
        },
        email: '',
        username: ''
      } // currentUser
    ) as Request

    res = userMockResponse()
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should create a user successfully', async () => {
    // Mock utils and validations
    const schemaParserSpy = jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)

    // Mock a valid owner/manager user
    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
      _id: validUserId,
      status: 'active',
      role: 'Owner',
      associatedBusinessesId: associatedBusinessId
    })

    // No existing account
    ;(userService.getUserByUsernameAndEmail as jest.Mock).mockResolvedValue(null)
    ;(authService.getUserByEmailOrUsername as jest.Mock).mockResolvedValue(null)

    // Valid business
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue({ 
      _id: associatedBusinessId, 
      businessName: 'Test Business',
      businessAddress: '123 Biz St',
      businessType: 'Retail',
      businessCategory: 'General',
      businessLogo: ''
    })

    await users.create(req, res, next)

    expect(schemaParserSpy).toHaveBeenCalledWith(expect.anything(), req.body)
    expect(authQueue.addAuthUserJob).toHaveBeenCalledWith('addAuthUserToDb', expect.anything())
    expect(userQueue.addUserJob).toHaveBeenCalledWith('addUserToDb', expect.anything())
    expect(businessQueue.updateBusisnessJob).toHaveBeenCalledWith('updateBusinessAdin', expect.anything())
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        message: 'User \'New User account created successfully',
      })
    )
  })

  it('should throw validation error for invalid user data', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue('Validation failed')

    await users.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ZodValidationError))
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Validation failed' })
    )
  })

  it('should throw NotAuthorizedError if user is not owner or manager', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)

    // Mock a user that is active but not Owner or Manager
    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
      _id: validUserId,
      status: 'active',
      role: 'Staff',
      associatedBusinessesId: associatedBusinessId
    })

    await users.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(NotAuthorizedError))
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid User: Not authorized for user role' })
    )
  })

  it('should throw BadRequestError if user already exists', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)

    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
      _id: validUserId,
      status: 'active',
      role: 'Owner',
      associatedBusinessesId: associatedBusinessId
    })

    // Mock existing user
    ;(userService.getUserByUsernameAndEmail as jest.Mock).mockResolvedValue({ _id: 'existingUserId' })
    ;(authService.getUserByEmailOrUsername as jest.Mock).mockResolvedValue(null)
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue({ _id: associatedBusinessId })

    await users.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'User account with this username or email already exists.' })
    )
  })

  it('should throw NotFoundError if business is invalid', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)

    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
      _id: validUserId,
      status: 'active',
      role: 'Owner',
      associatedBusinessesId: associatedBusinessId
    })

    ;(userService.getUserByUsernameAndEmail as jest.Mock).mockResolvedValue(null)
    ;(authService.getUserByEmailOrUsername as jest.Mock).mockResolvedValue(null)
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue(null)
    ;(businessService.getBusinessById as jest.Mock).mockResolvedValue(null)

    await users.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid Business: business not found' })
    )
  })

  it('should throw NotAuthorizedError if user not authorized for this business', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)

    // Mock authorized user but associated with a different business
    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
      _id: validUserId,
      status: 'active',
      role: 'Owner',
      associatedBusinessesId: '507f1f77bcf86cd799439099'
    })

    ;(userService.getUserByUsernameAndEmail as jest.Mock).mockResolvedValue(null)
    ;(authService.getUserByEmailOrUsername as jest.Mock).mockResolvedValue(null)
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue({ _id: associatedBusinessId })

    await users.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(NotAuthorizedError))
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid Business: not authorized for this business' })
    )
  })

  it('should handle queue failure gracefully', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
    jest.spyOn(Utils, 'sanitizeInput').mockReturnValue(req.body)

    ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
      _id: validUserId,
      status: 'active',
      role: 'Owner',
      associatedBusinessesId: associatedBusinessId
    })
    ;(businessCache.getBusinessFromCache as jest.Mock).mockResolvedValue({ 
      _id: associatedBusinessId, 
      businessName: 'Test Business',
      businessAddress: '123 Biz St',
      businessType: 'Retail',
      businessCategory: 'General',
      businessLogo: ''
    })
    ;(userService.getUserByUsernameAndEmail as jest.Mock).mockResolvedValue(null)
    ;(authService.getUserByEmailOrUsername as jest.Mock).mockResolvedValue(null)

    // Force queue failure
    ;(authQueue.addAuthUserJob as jest.Mock).mockImplementation(() => {
      throw new Error('Queue failure')
    })

    await users.create(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ServerError))
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Failed to process registration. Please try again.' })
    )
  })
})
