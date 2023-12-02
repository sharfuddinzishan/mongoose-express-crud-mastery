/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'

export const resMsg = (
  res: Response,
  message: string,
  err: any,
  code: number,
  desc: string = ''
) => {
  return res.status(code).json({
    success: false,
    message,
    error: {
      code: code || err?.statusCode || 500,
      description:
        err?.issues || err?.message || err || desc || 'Internal Server Error'
    }
  })
}
