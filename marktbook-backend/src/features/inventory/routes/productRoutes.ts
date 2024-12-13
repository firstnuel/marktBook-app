import express, { Router } from 'express'
import { product } from '@inventory/controllers/products'
import { authMiddleware } from '@global/helpers/auth-middleware'


class ProductRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public productRoutes(): Router {
    this.router.post('/products', authMiddleware.checkAuthentication, product.create)


    return this.router
  }


}

export const productRoutes: ProductRoutes = new ProductRoutes()
