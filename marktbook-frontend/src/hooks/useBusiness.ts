import {
  clearError,
  fetchBusiness,
  update,
  setMainOpt,
  fetchBusinessUsers,
  createUser,
  setSubOpt,
  fetchUser,
  updateUser,
  deleteUser,
  deleteBusiness,
  rmUser,
} from '@reducers/businessReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useCallback } from 'react'
import { Business } from '@typess/bizness'
import { User } from '@typess/auth'

export const useBusiness = () => {
  const { business, error, loading, success, mainOpt, users, subOpt, user } = useAppSelector(state => state.business)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [error, dispatch, success])

  const clearErrorHandler = useCallback(() => dispatch(clearError()), [dispatch])

  const rmUserHandler = useCallback(() => dispatch(rmUser()), [dispatch])

  const setMainOption = useCallback((option: string) => dispatch(setMainOpt({ option })), [dispatch])

  const setSubOption = useCallback((option: string) => dispatch(setSubOpt({ option })), [dispatch])

  const fetchBusinessHandler = useCallback((businessId: string) => dispatch(fetchBusiness(businessId)), [dispatch])

  const fetchUsersHandler = useCallback(() => dispatch(fetchBusinessUsers()), [dispatch])

  const fetchUserHandler = useCallback((userId: string) => dispatch(fetchUser(userId)), [dispatch])

  const deleteUserHandler = useCallback((userId: string) => dispatch(deleteUser(userId)), [dispatch])

  const deleteBusinessHandler = useCallback((businessId: string) => dispatch(deleteBusiness(businessId)), [dispatch])

  const createUserHandler = useCallback((data: Partial<User>) => dispatch(createUser(data)), [dispatch])

  const updateHandler = useCallback((businessId: string, data: Partial<Business>) =>
    dispatch(update({ businessId, data })), [dispatch])

  const updateUserHandler = useCallback((userId: string, data: Partial<User>) =>
    dispatch(updateUser({ userId, data })), [dispatch])

  return{
    mainOpt,
    business,
    loading,
    success,
    error,
    users,
    subOpt,
    user,
    deleteBusiness: deleteBusinessHandler,
    deleteUser: deleteUserHandler,
    updateUser: updateUserHandler,
    rmUser: rmUserHandler,
    fetchUser: fetchUserHandler,
    createUser: createUserHandler,
    clearError: clearErrorHandler,
    fetchBusiness: fetchBusinessHandler,
    update: updateHandler,
    setMainOpt: setMainOption,
    setSubOpt: setSubOption,
    fetchBusinessUsers: fetchUsersHandler
  }
}