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
    const result = await User.findOne({ userId }, { _id: 0, password: 0 })
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

export const userServices = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
}
