import { authRoutes } from '@auth/routes/authRoutes'
import { currentUserRoutes } from '@auth/routes/currentUserRoutes'
import { productRoutes } from '@inventory/routes/productRoutes'
import { serverAdapter } from '@service/queues/base.queue'
import { Application } from 'express'
import { usersRoutes } from '@users/routes/userRoutes'
import { swaggerRouter } from './docs/swagger'
import { authMiddleware } from '@global/helpers/auth-middleware'

const BASE_PATH = '/api/v1/'

export default (app: Application) => {
  const routes = () => {

    app.use(swaggerRouter) // Serve Swagger docs
    app.use('/queues', serverAdapter.getRouter()) //Serve bull UI
    app.use(BASE_PATH, authRoutes.routes())
    app.use(BASE_PATH, authRoutes.logoutRoute())

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.currentUserRoute())
    app.use(BASE_PATH, authMiddleware.verifyUser, productRoutes.productRoutes())
    app.use(BASE_PATH, authMiddleware.verifyUser, usersRoutes.UsersRoutes())
  }

  routes()
}