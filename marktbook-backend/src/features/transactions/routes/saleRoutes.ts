import express, { Router } from 'express'
import { sale } from '@transactions/controllers/sales'
import { authMiddleware } from '@global/helpers/auth-middleware'


class SaleRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public SaleRoutes(): Router {
    this.router.post('/sales', authMiddleware.checkAuthentication, sale.new)
    this.router.get('/sales', authMiddleware.checkAuthentication, sale.read)
    this.router.get('/sales/:id', authMiddleware.checkAuthentication, sale.fetch)

    return this.router
  }
}

export const saleRoutes = new SaleRoutes()