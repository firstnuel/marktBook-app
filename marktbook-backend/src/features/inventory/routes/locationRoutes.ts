import express, { Router } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { location } from '@inventory/controllers/location'


class LocationRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public locationRoutes(): Router {
    this.router.post('/locations', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      location.create)

    this.router.get('/locations', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      location.read)

    this.router.get('/locations/:id', 
      authMiddleware.checkAuthentication, 
      location.fetch)

    this.router.patch('/locations/:id', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      authMiddleware.validateBusiness,
      location.edit)

    return this.router
  }


}

export const locationRoutes: LocationRoutes = new LocationRoutes()