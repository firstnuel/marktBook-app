import { Request, Response } from 'express'
import { currentUser } from '@auth/controllers/current-user'
import { userCache } from '@service/redis/user.cache'
import { userService } from '@service/db/user.service'
import { authMockRequest, authMockResponse } from '@root/mocks/auth.mock'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import HTTP_STATUS from 'http-status-codes'
import { omit } from 'lodash'

jest.mock('@service/redis/user.cache', () => ({
  userCache: {
    getUserfromCache: jest.fn(),
  },
}))

jest.mock('@service/db/user.service', () => ({
  userService: {
    getUserById: jest.fn(),
  },
}))

describe('CurrentUser Controller', () => {
  let req: Request
  let res: Response

  beforeEach(() => {
    req = authMockRequest(
      { jwt: 'mocked-jwt-token' },
      {},
      {
        userId: '12345',
        businessId: '',
        uId: {
          userUId: '',
          businessUId: ''
        },
        email: '',
        username: ''
      }
    ) as Request
    res = authMockResponse()
    jest.clearAllMocks()
  })

  it('should return user data from cache if available', async () => {
    const cachedUser: IuserDocument = {
      _id: '12345',
      username: 'testuser',
      email: 'user@example.com',
      associatedBusinessesId: 'business123',
      authId: 'auth123',
      isVerified: true,
    } as IuserDocument;

    (userCache.getUserfromCache as jest.Mock).mockResolvedValue(cachedUser)

    await currentUser.read(req, res)

    const expectedUser = omit(cachedUser, [
      'authId',
      '__v',
      'createdAt',
      'updatedAt',
      'emergencyContact',
      'notificationPreferences',
      'address',
      'mobileNumber',
      'profilePicture',
      'status',
      'associatedBusinessesId',
      'isVerified',
    ])

    expect(userCache.getUserfromCache).toHaveBeenCalledWith('12345')
    expect(userService.getUserById).not.toHaveBeenCalled() // Should not call DB
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      isUser: true,
      token: 'mocked-jwt-token',
      user: expectedUser,
    })
  })

  it('should fetch user data from database if not in cache', async () => {
    (userCache.getUserfromCache as jest.Mock).mockResolvedValue(null)

    const dbUser: IuserDocument = {
      _id: '12345',
      username: 'testuser',
      email: 'user@example.com',
      associatedBusinessesId: 'business123',
      authId: 'auth123',
      isVerified: true,
    } as IuserDocument;

    (userService.getUserById as jest.Mock).mockResolvedValue(dbUser)

    await currentUser.read(req, res)

    const expectedUser = omit(dbUser, [
      'authId',
      '__v',
      'createdAt',
      'updatedAt',
      'emergencyContact',
      'notificationPreferences',
      'address',
      'mobileNumber',
      'profilePicture',
      'status',
      'associatedBusinessesId',
      'isVerified',
    ])

    expect(userCache.getUserfromCache).toHaveBeenCalledWith('12345')
    expect(userService.getUserById).toHaveBeenCalledWith('12345')
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      isUser: true,
      token: 'mocked-jwt-token',
      user: expectedUser,
    })
  })

  it('should return default response if no user is found', async () => {
    (userCache.getUserfromCache as jest.Mock).mockResolvedValue(null);
    (userService.getUserById as jest.Mock).mockResolvedValue(null)

    await currentUser.read(req, res)

    expect(userCache.getUserfromCache).toHaveBeenCalledWith('12345')
    expect(userService.getUserById).toHaveBeenCalledWith('12345')
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      isUser: false,
      token: null,
      user: null,
    })
  })
})
