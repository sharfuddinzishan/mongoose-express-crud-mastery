import express from 'express'
import { userControllers } from './User.controller'

// Express Router instance.
const router = express.Router()

// Route for create a user.
router.post('/users', userControllers.createUserController)

// Route for getting all users information.
router.get('/users', userControllers.getUsersController)

// Route for fetching a user by user ID.
router.get('/users/:userId', userControllers.getUserByIdController)

// Route for updating a user by user ID.
router.put('/users/:userId', userControllers.updateUserByIdController)

// Route for deleting a user by user ID.
router.delete('/users/:userId', userControllers.deleteUserByIdController)

// Route for fetching orders by user ID.
router.get('/users/:userId/orders', userControllers.getOrdersByIdController)

// Route for calculating the total price of orders.
router.get(
  '/users/:userId/orders/total-price',
  userControllers.getTotalPriceController
)

// Route for add new order.
router.put('/users/:userId/orders', userControllers.addOrderController)

export const userRouters = router
