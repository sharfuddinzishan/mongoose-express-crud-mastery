import { Request, Response } from 'express'
import { UserZodValidator } from './User.validator.zod'
import { userServices } from './User.service'
import { z } from 'zod'

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
const createUserController = async (req: Request, res: Response) => {
  const getUserDataFromRequest = req.body
  try {
    const result = UserZodValidator.safeParse(getUserDataFromRequest)
    if (result.success) {
      const data = await userServices.creatUser(getUserDataFromRequest)
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

export const userControllers = {
  createUserController,
  getUsersController
}
