import { Request, Response } from 'express'
import { OrdersValidator, UserZodValidator } from './User.validator.zod'
import { userServices } from './User.service'
import { z } from 'zod'
import { resMsg } from '../../../utill/errorHandling'

// Creating a new user.
const createUserController = async (req: Request, res: Response) => {
  // Extract user data from the request body.
  const getUserDataFromRequest = req.body
  try {
    // Validate user data using the Zod schema.
    const result = UserZodValidator.safeParse(getUserDataFromRequest)
    if (result.success) {
      const data = await userServices.createUser(getUserDataFromRequest)
      res.send({
        success: true,
        message: 'User created successfully!',
        data
      })
    } else {
      throw result.error
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      resMsg(res, 'User Not Created', error.issues, 'Data Validation Failed')
    } else {
      // errorMsg(response,message,error,description)
      resMsg(res, 'User Not Created', error, 'Required Data Mismatch')
    }
  }
}

// Fetching all users.
const getUsersController = async (req: Request, res: Response) => {
  try {
    const data = await userServices.getUsers()
    if (!data.length) {
      throw new Error('No Users Data Found')
    }
    res.send({
      success: true,
      message: 'Users fetched successfully!',
      data
    })
  } catch (error: unknown) {
    resMsg(res, 'User Not Fetched', error)
  }
}

// Fetching a user by user ID.
const getUserByIdController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  try {
    const data = await userServices.getUser(getUserIdFromRequest)
    if (!data) {
      throw new Error('No Such User Found')
    }
    res.send({
      success: true,
      message: 'User fetched successfully!',
      data
    })
  } catch (error: unknown) {
    // errorMsg(response,message,error,description)
    resMsg(res, 'User Not Fetched', error, 'UserId Mismatch/Missing')
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
      const { status, data, error } = datas
      if (!status?.modifiedCount) {
        throw new Error(error || 'No Changes Occurred!')
      }
      res.send({
        success: true,
        message: 'Information updated successfully!',
        data
      })
    } else {
      throw result.error
    }
  } catch (error: unknown) {
    resMsg(res, 'Failed To Update Information', error, 'UserId Mismatch')
  }
}

// Deleting a user by user ID.
const deleteUserByIdController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  try {
    const data = await userServices.deleteUser(getUserIdFromRequest)
    if (!data) {
      throw new Error('No Such User Found')
    }
    res.send({
      success: true,
      message: 'User deleted successfully!',
      data: null
    })
  } catch (error: unknown) {
    resMsg(res, 'User Deleted Failed!', error, 'UserId Missing')
  }
}

// Fetching a orders by userId.
const getOrdersByIdController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  try {
    const data = await userServices.getUserOrder(getUserIdFromRequest)
    if (!data) {
      throw new Error('No Such User Found')
    }
    res.send({
      success: true,
      message: 'Order fetched successfully!',
      data
    })
  } catch (error: unknown) {
    resMsg(res, 'Orders Fatching Failed!', error, 'UserId Missing')
  }
}

// Calculating the sum of price from orders of a user.
const getTotalPriceController = async (req: Request, res: Response) => {
  const getUserIdFromRequest = +req.params.userId
  try {
    const data = await userServices.getTotalPrice(getUserIdFromRequest)
    if (!data) {
      throw new Error('No Such User Found')
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
        throw new Error('No Order Placed!')
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
    resMsg(res, 'User Added Failed!', error, 'UserId Missing')
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
