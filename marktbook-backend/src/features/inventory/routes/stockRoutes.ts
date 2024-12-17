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


    return this.router
  }

}

export const stockRoutes: StockRoutes = new StockRoutes()