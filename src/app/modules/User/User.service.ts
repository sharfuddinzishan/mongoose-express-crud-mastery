import { TUser } from './User.interface'
import { User } from './User.model'

const creatUser = async (getData: TUser) => {
  const userId = await User.generatedId(getData.userId || 0)
  const result = await User.create({ ...getData, userId })
  return result
}

export const userServices = {
  creatUser
}
