/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { OrdersValidator, UserZodValidator } from './User.validator.zod'
import { userServices } from './User.service'
import { resMsg } from '../../../utill/errorHandling'

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
      throw result.error
    }
  } catch (error) {
    // errorMsg(response,message,error,description)
    resMsg(res, 'User Not Created', error, 'Wrong Information Provided')
  }
}

// Fetching all users.
const getUsersController = async (req: Request, res: Response) => {
  try {
    const data = await userServices.getUsers()
    if (!data.length) {
      throw new Error('No Users Data Found')
    }
    res.status(201).json({
      success: true,
      message: 'Users fetched successfully!',
      data
    })
  } catch (error: any) {
    resMsg(res, 'Users fetched failed!', error, 'Server Problem')
  }
}

// Fetching a user by user ID.
const getUserByIdController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  try {
    const data = await userServices.getUser(getUserIdFromRequest)
    res.send({
      success: true,
      message: 'User fetched successfully!',
      data
    })
  } catch (error: any) {
    // errorMsg(response,message,error,description)
    resMsg(res, 'Users fetched failed!', error, 'Wrong Information Provided')
  }
}

// Updating a user by user ID.
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
      res.send({
        success: true,
        message: `${
          datas?.status?.modifiedCount
            ? 'User updated successfully!'
            : 'No changes in user information'
        }`,
        data: datas?.data
      })
    } else {
      throw result.error
    }
  } catch (error: any) {
    resMsg(res, 'User updated failed!', error, 'UserId Mismatch')
  }
}

// Deleting a user by user ID.
const deleteUserByIdController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  try {
    const data = await userServices.deleteUser(getUserIdFromRequest)
    if (!data) {
      const error: any = new Error('No User Data Found')
      error.statusCode = 409
      throw error
    }
    res.send({
      success: true,
      message: 'User deleted successfully!',
      data: null
    })
  } catch (error: any) {
    resMsg(res, 'User Deleted Failed!', error, 'UserId Missing')
  }
}

// Fetching a orders by userId.
const getOrdersByIdController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  try {
    const data = await userServices.getUserOrder(getUserIdFromRequest)
    if (!data) {
      const error: any = new Error('No User Data Found')
      error.statusCode = 409
      throw error
    }
    res.send({
      success: true,
      message: 'Order fetched successfully!',
      data
    })
  } catch (error: any) {
    resMsg(res, 'Orders fatched Failed!', error, 'UserId Missing')
  }
}

// Calculating the sum of price from orders of a user.
const getTotalPriceController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  try {
    const data = await userServices.getTotalPrice(getUserIdFromRequest)
    if (!data) {
      const error: any = new Error('No User Data Found')
      error.statusCode = 409
      throw error
    }
    res.send({
      success: true,
      message: 'Total price calculated successfully!',
      data
    })
  } catch (error: unknown) {
    resMsg(res, 'Failed To Calculate Total!', error, 'UserId Missing')
  }
}

// Add new order.
const addOrderController = async (req: Request, res: Response) => {
  const getUserDataFromRequest = req.body
  const getUserIdFromRequest = +req.params.userId
  try {
    // Validate order data using the Zod Order schema.
    const parseOrder = OrdersValidator.safeParse(getUserDataFromRequest)
    if (parseOrder.success) {
      const result = await userServices.addOrder(
        getUserIdFromRequest,
        getUserDataFromRequest
      )
      if (!result) {
        const error: any = new Error('No User Data Found')
        error.statusCode = 409
        throw error
      }
      res.send({
        success: true,
        message: 'Order created successfully!',
        data: null
      })
    } else {
      throw parseOrder.error
    }
  } catch (error: unknown) {
    resMsg(res, 'Order created failed!', error, 'UserId Missing')
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
