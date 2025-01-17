import express, { Router } from 'express'
import { product } from '@inventory/controllers/products'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { productManagement } from '@inventory/controllers/product-management'


class ProductRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public productRoutes(): Router {
    this.router.post('/products', authMiddleware.checkAuthentication, product.create)
    this.router.get('/products', authMiddleware.checkAuthentication, product.read)
    this.router.post('/products/batch', authMiddleware.checkAuthentication, product.batch)
    this.router.get('/products/categories/:category', authMiddleware.checkAuthentication, product.categories)
    this.router.get('/products/search', authMiddleware.checkAuthentication, product.search)
    this.router.get('/products/:productId', authMiddleware.checkAuthentication, productManagement.fetch)
    this.router.patch('/products/:productId', authMiddleware.checkAuthentication, productManagement.editProduct)
    this.router.delete('/products/:productId', authMiddleware.checkAuthentication, productManagement.deleteProduct)

    return this.router
  }

}

export const productRoutes: ProductRoutes = new ProductRoutes()
