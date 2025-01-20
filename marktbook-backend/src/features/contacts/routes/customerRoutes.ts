import express, { Router } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { customer } from '@contacts/controllers/customers'


class CustomerRoutes {
  private router: Router

  constructor(){
    this.router = express.Router()
  }

  public customerRoutes(): Router {
    this.router.post('/customers', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateBusiness,
      customer.create
    )

    return this.router
  }
}

export const customerRoutes = new CustomerRoutes()