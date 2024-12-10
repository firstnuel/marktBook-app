import express, { Router } from 'express'
import { Register } from '@auth/controllers/register'
import { Login } from '@auth/controllers/login'
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
    this.router.post('/register', Limiter, new Register().create)
    this.router.post('/login', Limiter, new Login().read)

    return this.router
  }


}


export const authRoutes: AuthRoutes = new AuthRoutes()
