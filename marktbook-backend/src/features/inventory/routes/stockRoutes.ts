import express, { Router } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { stock } from '@inventory/controllers/stocks'

class StockRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public StockRoutes(): Router {
    this.router.post('/stocks', authMiddleware.checkAuthentication, stock.create)
    this.router.get('/stocks', authMiddleware.checkAuthentication, stock.read)
    this.router.patch('/stocks/:productId', authMiddleware.checkAuthentication, stock.edit)
    this.router.get('/stocks/:productId', authMiddleware.checkAuthentication, stock.fetch)
    this.router.post('/stocks/movements', authMiddleware.checkAuthentication, stock.move)

    return this.router
  }

}

export const stockRoutes: StockRoutes = new StockRoutes()