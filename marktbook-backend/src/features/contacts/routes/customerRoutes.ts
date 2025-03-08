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

    this.router.get('/customers', 
      authMiddleware.checkAuthentication, 
      customer.read
    )

    this.router.patch('/customers/:id', 
      authMiddleware.checkAuthentication, 
      customer.edit
    )

    this.router.delete('/customers/:id', 
      authMiddleware.checkAuthentication, 
      customer.delete
    )

    this.router.get('/customers/:id', 
      authMiddleware.checkAuthentication, 
      customer.fetch
    )

    return this.router
  }
}

export const customerRoutes = new CustomerRoutes()