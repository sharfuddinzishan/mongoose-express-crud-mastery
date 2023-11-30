/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'

export type TOrders = {
  productName: string
  price: number
  quantity: number
}
export type TAddress = {
  street: string
  city: string
  country: string
}
export type TFullName = {
  firstName: string
  lastName: string
}
export type TUser = {
  userId: number
  fullName: TFullName
  email: string
  username: string
  password: string
  age?: number
  hobbies: string[]
  address?: TAddress
  isActive: boolean
  orders?: TOrders[]
}

export interface UserModel extends Model<TUser> {
  generatedTotal(getId: number): Promise<void>
  generatedId(getId: number): Promise<void>
  isUserExist(userId: number): Promise<TUser | null>
}
