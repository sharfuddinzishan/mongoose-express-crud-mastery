import { Schema, model } from 'mongoose'
import { TAddress, TOrders, TUser, UserModel } from './User.interface'
import validator from 'validator'

const OrdersSchema = new Schema<TOrders>(
  {
    productName: { type: String, required: true },
    price: { type: Number, min: 1, default: 1 },
    quantity: { type: Number, min: 1, default: 1 }
  },
  { _id: false }
)

const AddressSchema = new Schema<TAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  { _id: false }
)

const FullNameSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  { _id: false }
)

const UserSchema = new Schema<TUser, UserModel>(
  {
    userId: { type: Number, required: true },
    fullName: { type: FullNameSchema, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return validator.isEmail(value)
        },
        message: `{VALUES} is not a valid email address!`
      }
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 3 },
    age: { type: Number, min: 1, max: 200 },
    hobbies: { type: [String], min: 2, max: 10 },
    address: { type: AddressSchema },
    isActive: { type: Boolean, default: true },
    orders: [OrdersSchema]
  },
  { versionKey: false }
)
// Static Method To Generate userId if not provided in input
UserSchema.statics.generatedId = async function (gid) {
  try {
    const lastId = await User.findOne().sort('-userId').exec()
    if (!gid && !lastId) {
      return 1
    } else if (!gid && lastId) {
      return lastId.userId + 1
    } else {
      return +gid
    }
  } catch (error) {
    return new Error('Can Not Generated ID')
  }
}

// Model User
export const User = model<TUser, UserModel>('User', UserSchema)
