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

    return this.router
  }
}

export const businessRoutes = new BusinessRoutes()