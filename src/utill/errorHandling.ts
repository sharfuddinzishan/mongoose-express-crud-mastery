/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'

export const resMsg = (
  res: Response,
  message: string,
  err: any,
  desc: string = ''
) => {
  return res.send({
    success: false,
    message,
    error: {
      code: err?.statusCode || 500,
      description: err?.issues || err?.message || err || desc
    }
  })
}
