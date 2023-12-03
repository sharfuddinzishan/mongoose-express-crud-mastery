/* eslint-disable @typescript-eslint/no-explicit-any */
import { userNotFoundError } from '../../../utill/userNotFound'
import { TUser } from './User.interface'
import { User } from './User.model'

// Create a new user in the database.
/*
  ##  If no userId is provided:
        * If the database has no users, return 1.
        * Otherwise, add 1 to the last sorted userId from the Users collection.
  ##  If a userId is provided, return that same userId.
  ##  During user creation, check if the provided userId is unique using a schema model.
*/
const createUser = async (getData: TUser) => {
  const userId = await User.generatedId(getData.userId || 0)
  const result = await User.create({ ...getData, userId })
  return result
}

// Retrieve a list of users with limited properties.
const getUsers = async () => {
  const result = await User.find(
    {},
    { _id: 0, username: 1, fullName: 1, age: 1, email: 1, address: 1 }
  )
  return result
}

// Retrieve a user by user ID by hiding password and orders.
const getUser = async (userId: number) => {
  try {
    // isUserExist() is static function used to check user exist or not
    if (await User.isUserExist(userId)) {
      const result = await User.findOne(
        { userId },
        { _id: 0, orders: 0, password: 0 }
      )
      return result
    }
  } catch (error) {
    return error
  }
}

const updateUser = async (userId: number, bodyParseData: TUser) => {
  try {
    if (await User.isUserExist(userId)) {
      // Update user data while excluding the password field.
      const updateData = await User.updateOne({ userId }, bodyParseData)
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const { password, ...restdata } = bodyParseData // Omit the password field.
      return { updateData, restdata }
    } else {
      // This function used to send error response
      userNotFoundError()
    }
  } catch (error: any) {
    // error.statusCode comes from userNotFoundError()
    // 409 for unique constraint type error status
    error.statusCode = error?.statusCode || 409
    throw error
  }
}

// Delete a user by user ID.
const deleteUser = async (userId: number) => {
  if (await User.isUserExist(userId)) {
    const result = await User.deleteOne({ userId })
    return result
  } else {
    return false
  }
}

// Retrieve a user's orders by user ID.
const getUserOrder = async (userId: number) => {
  if (await User.isUserExist(userId)) {
    const result = await User.findOne({ userId }, { _id: 0, orders: 1 })
    return result
  } else {
    return false
  }
}

// Calculate total price of all orders of a user by userId.
const getTotalPrice = async (userId: number) => {
  // Check user exist or not
  if (await User.isUserExist(userId)) {
    const result = await User.generatedTotal(userId)
    return result
  } else {
    return false
  }
}

// Add a new order if user is exist.
const addOrder = async (userId: number, bodyParseData: TUser) => {
  if (await User.isUserExist(userId)) {
    const result = await User.updateOne(
      { userId },
      {
        $push: { orders: bodyParseData }
      }
    )
    return result
  } else {
    return false
  }
}

export const userServices = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserOrder,
  getTotalPrice,
  addOrder
}
