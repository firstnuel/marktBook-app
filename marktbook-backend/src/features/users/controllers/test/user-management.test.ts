/* eslint-disable @typescript-eslint/no-explicit-any */
import { userManagement } from '@users/controllers/user-management'  
import { userService } from '@service/db/user.service'
import { Request, Response, NextFunction } from 'express'
import { userMockRequest, userMockResponse } from '@root/mocks/user.mock'
import { userCache } from '@service/redis/user.cache'
import { Utils } from '@global/helpers/utils'
import HTTP_STATUS from 'http-status-codes'
import { ZodValidationError, NotAuthorizedError } from '@global/helpers/error-handlers'
import { editUserSchema } from '@users/schemes/userValidation'
import { filterAllowedFields } from '@users/interfaces/user.interface'

jest.mock('@service/db/user.service', () => ({
  userService: {
    getUserById: jest.fn(),
    editUser: jest.fn(),
    deleteUserById: jest.fn(),
  },
}))

jest.mock('@service/redis/user.cache', () => ({
  userCache: {
    getUserfromCache: jest.fn(),
  },
}))

jest.mock('@global/helpers/utils', () => ({
  Utils: {
    sanitizeInput: jest.fn((value: any) => value),
    schemaParser: jest.fn(),
  },
}))

jest.mock('@users/interfaces/user.interface', () => ({
  ...jest.requireActual('@users/interfaces/user.interface'),
  filterAllowedFields: jest.fn((data) => data),
}))

describe('UserManagement Controller', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  const validUserId = '507f1f77bcf86cd799439011' // user making request
  const targetUserId = '507f1f77bcf86cd799439012' // user being fetched/edited/deleted

  beforeEach(() => {
    req = userMockRequest(
      { jwt: 'mocked-jwt' },
      {},
      {
        userId: validUserId,
        businessId: '',
        uId: {
          userUId: '',
          businessUId: ''
        },
        email: '',
        username: ''
      },
      { id: targetUserId }
    ) as Request
    res = userMockResponse()
    next = jest.fn()

    jest.clearAllMocks()
  })

  describe('getUser', () => {
    it('should fetch user successfully', async () => {
      // Mock validation of requesting user
      // Inherited validateUser method relies on userCache or userService
      ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        status: 'active',
        role: 'Owner',
      })
      // Mock user found
      ;(userService.getUserById as jest.Mock).mockResolvedValue({
        _id: targetUserId,
        name: 'Test User',
      })

      await userManagement.getUser(req, res, next)

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'User fetched successfully',
          data: { _id: targetUserId, name: 'Test User' },
        })
      )
    })

    it('should return 404 if user not found', async () => {
      ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        status: 'active',
        role: 'Owner',
      })
      ;(userService.getUserById as jest.Mock).mockResolvedValue(null)

      await userManagement.getUser(req, res, next)

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User not found',
      })
    })

    it('should call next with error if validateUser fails', async () => {
      // For example, if user is not authorized
      ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        status: 'active',
        role: 'Staff', // Not allowed role
      })

      await userManagement.getUser(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotAuthorizedError))
    })
  })

  describe('editUser', () => {
    beforeEach(() => {
      req.method = 'PUT'
      req.body = { role: 'Manager', status: 'active' }
    })

    it('should edit user successfully', async () => {
      ;(Utils.schemaParser as jest.Mock).mockReturnValue(true)
      ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        status: 'active',
        role: 'Owner',
      })
      ;(userService.getUserById as jest.Mock).mockResolvedValue({
        _id: targetUserId,
        name: 'Target User',
      })
      ;(userService.editUser as jest.Mock).mockResolvedValue({
        _id: targetUserId,
        role: 'Manager',
        status: 'active',
      })

      await userManagement.editUser(req, res, next)

      expect(Utils.schemaParser).toHaveBeenCalledWith(editUserSchema, req.body)
      expect(filterAllowedFields).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'User updated successfully',
          data: { _id: targetUserId, role: 'Manager', status: 'active' },
        })
      )
    })

    it('should return 404 if user to edit not found', async () => {
      ;(Utils.schemaParser as jest.Mock).mockReturnValue(true)
      ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        status: 'active',
        role: 'Owner',
      })
      ;(userService.getUserById as jest.Mock).mockResolvedValue(null)

      await userManagement.editUser(req, res, next)

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND)
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' })
    })

    it('should throw validation error if input is invalid', async () => {
      ;(Utils.schemaParser as jest.Mock).mockReturnValue('Validation failed')

      await userManagement.editUser(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(ZodValidationError))
    })

    it('should call next with error if user not authorized', async () => {
      // For instance, user is staff not allowed to edit
      ;(Utils.schemaParser as jest.Mock).mockReturnValue(true)
      ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        status: 'active',
        role: 'Staff',
      })

      await userManagement.editUser(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotAuthorizedError))
    })
  })

  describe('deleteUser', () => {
    beforeEach(() => {
      req.method = 'DELETE'
    })

    it('should delete user successfully', async () => {
      ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        status: 'active',
        role: 'Owner',
      })
      ;(userService.getUserById as jest.Mock).mockResolvedValue({
        _id: targetUserId,
        name: 'User to Delete',
      })

      await userManagement.deleteUser(req, res, next)

      expect(userService.deleteUserById).toHaveBeenCalledWith(targetUserId)
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'User deleted successfully',
        })
      )
    })

    it('should return 404 if user not found', async () => {
      ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        status: 'active',
        role: 'Owner',
      })
      ;(userService.getUserById as jest.Mock).mockResolvedValue(null)

      await userManagement.deleteUser(req, res, next)

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND)
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' })
    })

    it('should call next with error if user not authorized', async () => {
      ;(userCache.getUserfromCache as jest.Mock).mockResolvedValue({
        _id: validUserId,
        status: 'active',
        role: 'Staff',
      })

      await userManagement.deleteUser(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotAuthorizedError))
    })
  })
})
