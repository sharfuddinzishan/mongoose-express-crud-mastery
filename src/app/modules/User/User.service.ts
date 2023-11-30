import { TUser } from './User.interface'
import { User } from './User.model'

const createUser = async (getData: TUser) => {
  const userId = await User.generatedId(getData.userId || 0)
  const result = await User.create({ ...getData, userId })
  return result
}

const getUsers = async () => {
  const result = await User.find(
    {},
    { _id: 0, username: 1, fullName: 1, age: 1, email: 1, address: 1 }
  )
  return result
}

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

const updateUser = async (userId: number, bodyParseData: TUser) => {
  if (await User.isUserExist(userId)) {
    const status = await User.updateOne({ userId: userId }, bodyParseData)
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...data } = bodyParseData
    return { status, data, error: null }
  } else {
    return {
      error: 'No Such User Found'
    }
  }
}

const deleteUser = async (userId: number) => {
  if (await User.isUserExist(userId)) {
    const result = await User.deleteOne({ userId })
    return result
  } else {
    return false
  }
}

const getUserOrder = async (userId: number) => {
  if (await User.isUserExist(userId)) {
    const result = await User.findOne({ userId }, { _id: 0, orders: 1 })
    return result
  } else {
    return false
  }
}

const getTotalPrice = async (userId: number) => {
  if (await User.isUserExist(userId)) {
    const result = await User.aggregate([
      {
        $match: {
          userId
        }
      },
      {
        $project: {
          orders: 1,
          _id: 0
        }
      },
      {
        $unwind: '$orders'
      },
      {
        $group: {
          _id: 'totalPrice',
          totalPrice: {
            $sum: {
              $multiply: ['$orders.price', '$orders.quantity']
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalPrice: 1
        }
      }
    ])
    return result.length ? result[0] : result
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
  getTotalPrice
}
