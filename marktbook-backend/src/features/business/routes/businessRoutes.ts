import express, { Router } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { business } from '@business/controllers/business'

class BusinessRoutes {
  private router: Router 

  constructor() {
    this.router = express.Router()
  }

  public businessRoutes(): Router {
    this.router.patch('/business/:businessId', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      authMiddleware.validateBusiness,
      business.editBusiness
    )
    this.router.get('/business/:businessId', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateBusiness,
      business.fetch
    )

    this.router.delete('/business/:businessId', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      authMiddleware.validateBusiness,
      business.delete
    )


    return this.router
  }
}

export const businessRoutes = new BusinessRoutes()