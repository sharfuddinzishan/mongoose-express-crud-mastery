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

// Defining a type TUser from which will be Schema Created
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
  orders?: TOrders[] // Optional property for user orders.
}

// UserModel Extends the Model class from mongoose
// This model provides static methods to get information from database.
export interface UserModel extends Model<TUser> {
  generatedTotal(getId: number): Promise<void> // Total Price Calculate
  generatedId(getId: number): Promise<void> // Auto UserId generated if not provided in input
  isUserExist(userId: number): Promise<TUser | null>
}
