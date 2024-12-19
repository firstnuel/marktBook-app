import express, { Router } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { currentUser } from '@auth/controllers/current-user'


class CurrentUserRoutes {
  private router: Router
  
  constructor() {
    this.router = express.Router()
  }

  public currentUserRoute(): Router {
    this.router.get('/me', authMiddleware.checkAuthentication, currentUser.read)
    
    return this.router
  }

}


export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes()