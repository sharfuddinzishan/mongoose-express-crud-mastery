import express from 'express'
import { userControllers } from './User.controller'

const router = express.Router()

router.post('/users', userControllers.createUserController)
router.get('/users', userControllers.getUsersController)
router.get('/users/:userId', userControllers.getUserByIdController)
router.put('/users/:userId', userControllers.updateUserByIdController)
router.delete('/users/:userId', userControllers.deleteUserByIdController)
router.get('/users/:userId/orders', userControllers.getOrdersByIdController)
router.get(
  '/users/:userId/orders/total-price',
  userControllers.getTotalPriceController
)
router.put('/users/:userId/orders', userControllers.addOrderController)

export const userRouters = router
