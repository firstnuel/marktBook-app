import { authRoutes } from '@auth/routes/authRoutes'
import { currentUserRoutes } from '@auth/routes/currentUserRoutes'
import { productRoutes } from '@inventory/routes/productRoutes'
import { serverAdapter } from '@service/queues/base.queue'
import { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'
import { authMiddleware } from '@global/helpers/auth-middleware'

const BASE_PATH = '/api/v1/'
const swaggerDocument = YAML.load(path.join(__dirname, 'api-docs.yaml'))

export default (app: Application) => {
  const routes = () => {

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)) // Serve Swagger docs
    app.use('/queues', serverAdapter.getRouter()) // bull UI
    app.use(BASE_PATH, authRoutes.routes())
    app.use(BASE_PATH, authRoutes.logoutRoute())

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.currentUserRoute())
    app.use(BASE_PATH, authMiddleware.verifyUser, productRoutes.productRoutes())
  }

  routes()
}