import { Request, Response } from 'express'
import { UserZodValidator } from './User.validator.zod'
import { userServices } from './User.service'
import { z } from 'zod'

const createUserController = async (req: Request, res: Response) => {
  const getUserDataFromRequest = req.body
  try {
    const result = UserZodValidator.safeParse(getUserDataFromRequest)
    if (result.success) {
      const data = await userServices.creatUser(getUserDataFromRequest)
      res.send({
        success: true,
        message: 'New User Created',
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
        error: error.issues
      })
    } else {
      res.send({
        success: false,
        message: 'User Not Created',
        error
      })
    }
  }
}

export const userControllers = {
  createUserController
}
