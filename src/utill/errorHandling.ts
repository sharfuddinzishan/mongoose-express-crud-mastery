import { Response } from 'express'

export const resMsg = (
  res: Response,
  message: string,
  err: unknown,
  desc: string = ''
) => {
  return res.send({
    success: false,
    message,
    error: {
      code: 404,
      description: `${err || desc}`
    }
  })
}
