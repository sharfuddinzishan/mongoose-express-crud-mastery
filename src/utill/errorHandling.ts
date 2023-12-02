/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'

// This function used to send error response, if user not found from database
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
