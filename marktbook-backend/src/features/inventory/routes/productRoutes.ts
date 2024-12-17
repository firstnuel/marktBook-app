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
    this.router.get('/products', authMiddleware.checkAuthentication, product.read.bind(product))
    this.router.get('/products/categories/:category', authMiddleware.checkAuthentication, product.categories.bind(product))
    this.router.get('/products/search', authMiddleware.checkAuthentication, product.search.bind(product))
    this.router.get('/products/:productId', authMiddleware.checkAuthentication, productManagement.fetch.bind(product))
    this.router.patch('/products/:productId', authMiddleware.checkAuthentication, productManagement.editProduct.bind(product))
    this.router.delete('/products/:productId', authMiddleware.checkAuthentication, productManagement.deleteProduct.bind(product))

    return this.router
  }

}

export const productRoutes: ProductRoutes = new ProductRoutes()
