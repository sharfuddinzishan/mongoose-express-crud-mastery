/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { OrdersValidator, UserZodValidator } from './User.validator.zod'
import { userServices } from './User.service'
import { resMsg } from '../../../utill/errorHandling'
import { userNotFoundError } from '../../../utill/userNotFound'

// Creating a new user.
const createUserController = async (req: Request, res: Response) => {
  const getUserDataFromRequest = req.body
  try {
    // Validate user data using the Zod schema.
    const result = await UserZodValidator.safeParse(getUserDataFromRequest)
    if (result.success) {
      const data = await userServices.createUser(getUserDataFromRequest)
      res.status(201).json({
        success: true,
        message: 'User created successfully!',
        data
      })
    } else {
      // errorMsg(response,message,error,statusCode,description)
      resMsg(res, 'User validation failed', result.error, 404)
    }
  } catch (error) {
    resMsg(res, 'User Not Created', error, 409)
  }
}

// Fetching all users.
const getUsersController = async (req: Request, res: Response) => {
  try {
    const data = await userServices.getUsers()
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data
    })
  } catch (error: any) {
    resMsg(res, 'Users fetched failed!', error, 500)
  }
}

// Fetching a user by user ID.
const getUserByIdController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  if (isNaN(getUserIdFromRequest)) {
    return resMsg(res, 'User fetch failed!', null, 400, 'Invalid userId format')
  }
  try {
    const data = await userServices.getUser(getUserIdFromRequest)
    if (!data) {
      // User not found
      return resMsg(res, 'User not found!', null, 404, 'userId Not Matched')
    }
    res.status(200).json({
      success: true,
      message: 'User fetched successfully!',
      data
    })
  } catch (error) {
    resMsg(res, 'User fetch failed!', error, 500)
  }
}

const updateUserByIdController = async (req: Request, res: Response) => {
  const getUserDataFromRequest = req.body
  const getUserIdFromRequest = +req.params.userId
  try {
    // Validate user data using the Zod schema.
    const result = UserZodValidator.safeParse(getUserDataFromRequest)
    if (result.success) {
      const datas = await userServices.updateUser(
        getUserIdFromRequest,
        getUserDataFromRequest
      )
      res.status(200).json({
        success: true,
        message: `${
          datas?.status?.modifiedCount
            ? 'User updated successfully!'
            : 'No changes in user information'
        }`,
        data: datas?.data
      })
    } else {
      resMsg(res, 'User validation failed', result.error, 404)
    }
  } catch (error: any) {
    resMsg(res, 'User updated failed!', error, error.statusCode || 409)
  }
}

// Deleting a user by user ID.
const deleteUserByIdController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  try {
    const data = await userServices.deleteUser(getUserIdFromRequest)
    if (!data) {
      userNotFoundError()
    }
    res.send({
      success: true,
      message: 'User deleted successfully!',
      data: null
    })
  } catch (error: any) {
    resMsg(res, 'User Deleted Failed!', error, 500, 'UserId Missing')
  }
}

// Fetching a orders by userId.
const getOrdersByIdController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  if (isNaN(getUserIdFromRequest)) {
    return resMsg(res, 'User fetch failed!', null, 400, 'Invalid userId format')
  }
  try {
    const data = await userServices.getUserOrder(getUserIdFromRequest)
    if (!data) {
      userNotFoundError()
    }
    res.status(200).json({
      success: true,
      message: `${
        data ? 'Order fetched successfully!' : 'User Have No Order!'
      }`,
      data
    })
  } catch (error: any) {
    resMsg(res, 'Orders fatched Failed!', error, error?.statusCode || 500)
  }
}

// Calculating the sum of price from orders of a user.
const getTotalPriceController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  if (isNaN(getUserIdFromRequest)) {
    return resMsg(res, 'User fetch failed!', null, 400, 'Invalid userId format')
  }
  try {
    const data = await userServices.getTotalPrice(getUserIdFromRequest)
    if (!data) {
      userNotFoundError()
    }
    res.send({
      success: true,
      message: 'Total price calculated successfully!',
      data
    })
  } catch (error: any) {
    resMsg(
      res,
      'Failed To Calculate Total!',
      error,
      error?.statusCode || 500,
      'UserId Missing'
    )
  }
}

// Add new order.
const addOrderController = async (req: Request, res: Response) => {
  const getUserDataFromRequest = req.body
  const getUserIdFromRequest = +req.params.userId
  if (isNaN(getUserIdFromRequest)) {
    return resMsg(res, 'User fetch failed!', null, 400, 'Invalid userId format')
  }
  try {
    // Validate order data using the Zod Order schema.
    const result = OrdersValidator.safeParse(getUserDataFromRequest)
    if (result.success) {
      const data = await userServices.addOrder(
        getUserIdFromRequest,
        getUserDataFromRequest
      )
      if (!data) {
        userNotFoundError()
      }
      res.status(200).json({
        success: true,
        message: 'Order created successfully!',
        data: null
      })
    } else {
      resMsg(res, 'User validation failed', result.error, 404)
    }
  } catch (error: any) {
    resMsg(res, 'Order created failed!', error, error?.statusCode || 500)
  }
}

export const userControllers = {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
  getOrdersByIdController,
  getTotalPriceController,
  addOrderController
}
