import { Request, Response } from 'express'
import { logout } from '@auth/controllers/logout'
import HTTP_STATUS from 'http-status-codes'
import { authMockRequest, authMockResponse } from '@root/mocks/auth.mock'

describe('Logout Controller', () => {
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
  })

  it('should clear session and return successful logout response', async () => {
    await logout.update(req, res)

    expect(req.session).toBeNull() // Ensure session is cleared
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK) // Check for correct HTTP status
    expect(res.json).toHaveBeenCalledWith({
      message: 'Logout successful',
      user: {},
      token: '',
    }) // Verify response payload
  })
})
