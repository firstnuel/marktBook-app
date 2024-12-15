import express, { Router } from 'express'
import { users } from '@users/controllers/users'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { userManagement } from '@users/controllers/user-management'


class UsersRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public UsersRoutes(): Router {
    this.router.post('/users', authMiddleware.checkAuthentication, users.create.bind(users))
    this.router.get('/users', authMiddleware.checkAuthentication, users.read.bind(users))
    this.router.get('/users/:id', authMiddleware.checkAuthentication, userManagement.getUser.bind(users))
    this.router.patch('/users/:id', authMiddleware.checkAuthentication, userManagement.editUser.bind(users))
    this.router.delete('/users/:id', authMiddleware.checkAuthentication, userManagement.deleteUser.bind(users))


    return this.router
  }


}

export const usersRoutes: UsersRoutes = new UsersRoutes()
