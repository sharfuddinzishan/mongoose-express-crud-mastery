import { TUser } from './User.interface'
import { User } from './User.model'

// Create a new user in the database.
const createUser = async (getData: TUser) => {
  /*
  If no userId is provided, the function will return:
    - 1 if the database has no users.
    - if database have other users then 
        - Add 1 to the last sorted (ascending) userId from the Users collection.

  If a userId is provided, the function will return that same userId.

  During user creation, schema model checks whether the userId is unique or not.
*/

  const userId = await User.generatedId(getData.userId || 0)
  // Create a new user with the modified data.
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
  if (await User.isUserExist(userId)) {
    const result = await User.findOne(
      { userId },
      { _id: 0, orders: 0, password: 0 }
    )
    return result
  } else {
    return false
  }
}

// Update user information by user ID.
// This function return {status,data,error}
// For success, error is null
const updateUser = async (userId: number, bodyParseData: TUser) => {
  if (await User.isUserExist(userId)) {
    // Update user data while excluding the password field.
    const status = await User.updateOne({ userId: userId }, bodyParseData)
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...data } = bodyParseData // Omit the password field.
    return { status, data, error: null }
  } else {
    return {
      error: 'No Such User Found'
    }
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
