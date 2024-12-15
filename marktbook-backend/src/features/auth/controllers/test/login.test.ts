import { Request, Response, NextFunction } from 'express'
import { login } from '@auth/controllers/login'
import { authService } from '@root/shared/services/db/auth.service'
import { userService } from '@service/db/user.service'
import { Utils } from '@global/helpers/utils'
import JWT from 'jsonwebtoken'
import { authMockRequest, authMockResponse } from '@root/mocks/auth.mock'
import { ZodValidationError, BadRequestError } from '@global/helpers/error-handlers'


jest.mock('@root/shared/services/db/auth.service', () => ({
  authService: {
    getUserByEmailAndUsername: jest.fn(),
    getAuthUser: jest.fn(),
  },
}))

jest.mock('@service/db/user.service', () => ({
  userService: {
    updateUserLogin: jest.fn(),
  },
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}))

describe('Login Controller', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = authMockRequest({}, { email: 'user@example.com', username: 'testuser', password: 'Password123!' }) as Request
    res = authMockResponse()
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should throw validation error if input is invalid', async () => {
    req.body = { email: 'invalid-email', username: 'testuser', password: 'short' } // Invalid email and password
    jest.spyOn(Utils, 'schemaParser').mockReturnValue('Invalid input data')

    await login.read(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ZodValidationError))
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid input data' }))
  })

  it('should return an error if user does not exist', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true);
    (authService.getUserByEmailAndUsername as jest.Mock).mockResolvedValue(null)

    await login.read(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'invalid credentials, user not found' })
    )
  })

  it('should return an error if the password is incorrect', async () => {
    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true);
    (authService.getUserByEmailAndUsername as jest.Mock).mockResolvedValue({ _id: 'user123' });
    (authService.getAuthUser as jest.Mock).mockResolvedValue(null)

    await login.read(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'invalid credentials, password not correct' })
    )
  })

  it('should successfully log in a user and return a token', async () => {
    const mockUser = {
      _id: 'user123',
      username: 'testuser',
      associatedBusinessesId: 'business123',
      email: 'user@example.com',
      toObject: jest.fn().mockReturnValue({
        _id: 'user123',
        username: 'testuser',
        associatedBusinessesId: 'business123',
        email: 'user@example.com',
        authId: 'auth123',
        __v: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        lastLogin: '2024-01-01T00:00:00.000Z',
        emergencyContact: null,
        notificationPreferences: null,
      }),
    }

    jest.spyOn(Utils, 'schemaParser').mockReturnValue(true);
    (authService.getUserByEmailAndUsername as jest.Mock).mockResolvedValue(mockUser);
    (authService.getAuthUser as jest.Mock).mockResolvedValue(mockUser);
    (userService.updateUserLogin as jest.Mock).mockResolvedValue(true);
    (JWT.sign as jest.Mock).mockReturnValue('mocked-jwt-token')

    await login.read(req, res, next)

    expect(userService.updateUserLogin).toHaveBeenCalledWith('user123')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'user login successful',
        data: expect.any(Object),
        token: 'mocked-jwt-token',
      })
    )
  })
})
