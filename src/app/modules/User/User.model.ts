import { Schema, model } from 'mongoose'
import { TAddress, TOrders, TUser } from './User.interface'
import validator from 'validator'

const OrdersSchema = new Schema<TOrders>({
  productName: { type: String, required: true },
  price: { type: Number, min: 1, default: 1 },
  quantity: { type: Number, min: 1, default: 1 }
})
const AddressSchema = new Schema<TAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true }
})
const FullNameSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
})
const UserSchema = new Schema<TUser>(
  {
    userId: { type: Number, required: true, unique: true },
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
    password: { type: String, required: true },
    age: { type: Number, min: 1 },
    hobbies: { type: [String], min: 2 },
    address: { type: AddressSchema },
    isActive: { type: Boolean, default: true },
    orders: { type: OrdersSchema }
  },
  { versionKey: false }
)

// Model User
export const User = model<TUser>('User', UserSchema)
