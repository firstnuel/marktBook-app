import express, { Router } from 'express'
import { register } from '@auth/controllers/register'
import { login } from '@auth/controllers/login'
import { logout } from '@auth/controllers/logout'
import rateLimit from 'express-rate-limit'



const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 registration requests per windowMs
  message: 'Too many attempts from this IP, please try again after 15 minutes.',
})


class AuthRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public routes(): Router {
    this.router.post('/register', Limiter, register.create)
    this.router.post('/login', Limiter, login.read)

    return this.router
  }

  public logoutRoute(): Router {
    this.router.get('/logout', logout.update)

    return this.router
  }


}

export const authRoutes: AuthRoutes = new AuthRoutes()
