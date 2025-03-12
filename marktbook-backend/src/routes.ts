import { authRoutes } from '@auth/routes/authRoutes'
import { currentUserRoutes } from '@auth/routes/currentUserRoutes'
import { productRoutes } from '@inventory/routes/productRoutes'
import { Application } from 'express'
import { usersRoutes } from '@users/routes/userRoutes'
import { swaggerRouter } from './docs/swagger'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { logsRoutes } from '@activity/routes/logRoutes'
import { stockRoutes } from '@inventory/routes/stockRoutes'
import { locationRoutes } from '@inventory/routes/locationRoutes'
import { saleRoutes } from '@transactions/routes/saleRoutes'
import { businessRoutes } from '@business/routes/businessRoutes'
import { customerRoutes } from '@contacts/routes/customerRoutes'
import { supplierRoutes } from '@contacts/routes/supplierRoutes'


const BASE_PATH = '/api/v1/'

export default (app: Application) => {
  const routes = () => {

    //Health check
    app.get('/health', (req, res) => {
      res.status(200).send('OK')
    })

    app.use(swaggerRouter) // Serve api docs
    app.use(BASE_PATH, authRoutes.routes())
    app.use(BASE_PATH, authRoutes.logoutRoute())

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.currentUserRoute())
    app.use(BASE_PATH, authMiddleware.verifyUser, productRoutes.productRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, usersRoutes.usersRoutes())

    app.use(BASE_PATH, authMiddleware.verifyUser, logsRoutes.logsRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, stockRoutes.stockRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, locationRoutes.locationRoutes())

    app.use(BASE_PATH, authMiddleware.verifyUser, saleRoutes.saleRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, businessRoutes.businessRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, customerRoutes.customerRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, supplierRoutes.supplierRoutes())
  }

  routes()
}