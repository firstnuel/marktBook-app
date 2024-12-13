import express, { Router } from 'express'
import { users } from '@users/controllers/users'
import { authMiddleware } from '@global/helpers/auth-middleware'


class UsersRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public UsersRoutes(): Router {
    this.router.post('/users', authMiddleware.checkAuthentication, users.create.bind(users))
    this.router.get('/users', authMiddleware.checkAuthentication, users.read)


    return this.router
  }


}

export const usersRoutes: UsersRoutes = new UsersRoutes()
