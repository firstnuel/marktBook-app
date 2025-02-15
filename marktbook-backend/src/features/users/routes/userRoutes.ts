import express, { Router } from 'express'
import { users } from '@users/controllers/users'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { userManagement } from '@users/controllers/user-management'


class UsersRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public usersRoutes(): Router {
    this.router.post('/users', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      authMiddleware.validateBusiness,
      users.create)

    this.router.get('/users', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      users.read)

    this.router.get('/users/:id', 
      authMiddleware.checkAuthentication,
      authMiddleware.validateUserRole,
      userManagement.getUser)

    this.router.patch('/users/:id', 
      authMiddleware.checkAuthentication, 
      userManagement.editUser)

    this.router.delete('/users/:id', 
      authMiddleware.checkAuthentication, 
      authMiddleware.validateUserRole,
      userManagement.deleteUser)


    return this.router
  }


}

export const usersRoutes: UsersRoutes = new UsersRoutes()
