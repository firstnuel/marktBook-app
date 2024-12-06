import express, { Router } from 'express'
import { Register } from '@auth/controllers/register'


class AuthRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public routes(): Router {
    this.router.post('/register', new Register().create)

    return this.router
  }


}


export const authRoutes: AuthRoutes = new AuthRoutes()
