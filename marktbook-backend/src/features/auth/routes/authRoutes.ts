import express, { Router } from 'express'
import { register } from '@auth/controllers/register'
import { login } from '@auth/controllers/login'
import { logout } from '@auth/controllers/logout'
import { password } from '@auth/controllers/password'
import { registerLimiter, loginLimiter, forgotPasswordLimiter } from '@global/helpers/limiters'


class AuthRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public routes(): Router {
    this.router.post('/register', registerLimiter, register.create)
    this.router.post('/login', loginLimiter, login.read)
    this.router.post('/forgot-password', forgotPasswordLimiter, password.create)
    this.router.post('/reset-password/:token', forgotPasswordLimiter, password.update)

    return this.router
  }

  public logoutRoute(): Router {
    this.router.get('/logout', logout.update)

    return this.router
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes()
