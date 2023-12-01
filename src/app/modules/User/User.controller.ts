import { Request, Response } from 'express'
import { OrdersValidator, UserZodValidator } from './User.validator.zod'
import { userServices } from './User.service'
import { z } from 'zod'

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
      res.send({
        success: false,
        message: 'User Not Created',
        error: {
          code: 404,
          description: `[Data Validation Failed] ${error.issues}`
        }
      })
    } else {
      res.send({
        success: false,
        message: 'User Not Created',
        error: {
          code: 404,
          description: `${error || 'Required Data Mismatch or Server Problem'}`
        }
      })
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
    res.send({
      success: false,
      message: 'Users Not Fetched',
      error: {
        code: 404,
        description: `${error}`
      }
    })
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
    res.send({
      success: false,
      message: 'User Not Fetched',
      error: {
        code: 404,
        description: `${error || 'User ID Mismatch or Not Found'}`
      }
    })
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
    res.send({
      success: false,
      message: 'Failed To Update Information',
      error: {
        code: 404,
        description: `${error || 'User ID/Data Mismatch or Not Found'}`
      }
    })
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
    res.send({
      success: false,
      message: 'User Not Deleted',
      error: {
        code: 404,
        description: `${error || 'User ID Not Found'}`
      }
    })
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
    res.send({
      success: false,
      message: 'Orders Not Fetched',
      error: {
        code: 404,
        description: `${error || 'User ID Mismatch or Not Found'}`
      }
    })
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
    res.send({
      success: false,
      message: 'No Result',
      error: {
        code: 404,
        description: `${error || 'User ID Mismatch or Not Found'}`
      }
    })
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
    res.send({
      success: false,
      message: 'Failed To Add Order',
      error: {
        code: 404,
        description: `${error || 'User ID/Data Mismatch or Not Found'}`
      }
    })
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
