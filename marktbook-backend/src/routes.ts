import { authRoutes } from '@auth/routes/authRoutes'
import { currentUserRoutes } from '@auth/routes/currentUserRoutes'
import { productRoutes } from '@inventory/routes/productRoutes'
import { serverAdapter } from '@service/queues/base.queue'
import { Application } from 'express'
import { usersRoutes } from '@users/routes/userRoutes'
import { swaggerRouter } from './docs/swagger'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { logsRoutes } from '@activity/routes/logRoutes'
import { stockRoutes } from '@inventory/routes/stockRoutes'
import { locationRoutes } from '@inventory/routes/locationRoutes'
import { saleRoutes } from '@transactions/routes/saleRoutes'
import { businessRoutes } from '@business/routes/businessRoutes'

const BASE_PATH = '/api/v1/'

export default (app: Application) => {
  const routes = () => {

    app.use(swaggerRouter) // Serve api docs
    app.use('/queues', serverAdapter.getRouter()) //Serve bull UI
    app.use(BASE_PATH, authRoutes.routes())
    app.use(BASE_PATH, authRoutes.logoutRoute())

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.currentUserRoute())
    app.use(BASE_PATH, authMiddleware.verifyUser, productRoutes.productRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, usersRoutes.UsersRoutes())

    app.use(BASE_PATH, authMiddleware.verifyUser, logsRoutes.LogsRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, stockRoutes.StockRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, locationRoutes.LocationRoutes())

    app.use(BASE_PATH, authMiddleware.verifyUser, saleRoutes.SaleRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, businessRoutes.businessRoutes())
  }

  routes()
}