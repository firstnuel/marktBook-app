import express, { Router } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { stock } from '@inventory/controllers/stocks'

class StockRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public stockRoutes(): Router {
    this.router.post('/stocks', 
      authMiddleware.checkAuthentication,
      authMiddleware.validateBusiness,
      stock.create)

    this.router.get('/stocks', 
      authMiddleware.checkAuthentication, 
      stock.read)

    this.router.get('/stocks/low-stock', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      stock.low)

    this.router.patch('/stocks/:productId', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      authMiddleware.validateBusiness,
      stock.edit)

    this.router.get('/stocks/:productId',
      authMiddleware.checkAuthentication, 
      stock.fetch)

    this.router.post('/stocks/movements', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      stock.move)

    this.router.get('/stocks/:supplierId', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      stock.fetchBySupplier)
  
    return this.router
  }

}

export const stockRoutes: StockRoutes = new StockRoutes()