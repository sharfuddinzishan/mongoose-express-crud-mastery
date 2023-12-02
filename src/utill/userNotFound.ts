/* eslint-disable @typescript-eslint/no-explicit-any */
export const userNotFoundError = (msg: string = 'User not found') => {
  const error: any = new Error(msg)
  error.statusCode = 404
  throw error
}
