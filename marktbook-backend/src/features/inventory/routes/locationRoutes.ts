import express, { Router } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { location } from '@inventory/controllers/location'


class LocationRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public LocationRoutes(): Router {
    this.router.post('/locations', authMiddleware.checkAuthentication, location.create)
    this.router.get('/locations', authMiddleware.checkAuthentication, location.read)
    this.router.get('/locations/:id', authMiddleware.checkAuthentication, location.fetch)
    this.router.patch('/locations/:id', authMiddleware.checkAuthentication, location.edit)

    return this.router
  }


}

export const locationRoutes: LocationRoutes = new LocationRoutes()