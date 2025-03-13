import express, { Router } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { logs } from '@activity/controllers/logs'


class LogsRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public logsRoutes(): Router {
    this.router.get('/logs', 
      authMiddleware.checkAuthentication, 
      logs.read.bind(logs))


    return this.router
  }


}

export const logsRoutes: LogsRoutes = new LogsRoutes()
