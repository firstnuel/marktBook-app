import express, { Router } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { supplier } from '@contacts/controllers/suppliers'


class SupplierRoutes {
  private router: Router

  constructor(){
    this.router = express.Router()
  }

  public supplierRoutes(): Router {
    this.router.post('/suppliers', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateBusiness,
      supplier.create
    )

    this.router.get('/suppliers', 
      authMiddleware.checkAuthentication, 
      supplier.read
    )

    this.router.patch('/suppliers/:id', 
      authMiddleware.checkAuthentication, 
      supplier.edit
    )

    this.router.delete('/suppliers/:id', 
      authMiddleware.checkAuthentication, 
      supplier.delete
    )

    this.router.get('/suppliers/:id', 
      authMiddleware.checkAuthentication, 
      supplier.fetch
    )

    return this.router
  }
}

export const supplierRoutes = new SupplierRoutes()
