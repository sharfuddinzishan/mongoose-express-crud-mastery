/* eslint-disable @typescript-eslint/no-var-requires */
import { Schema, model } from 'mongoose'
import { TAddress, TOrders, TUser, UserModel } from './User.interface'
import validator from 'validator'
import bcrypt from 'bcrypt'
import config from '../../config'
// const passwordHash = require('password-hash')

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
    password: { type: String, required: true, min: 3 },
    age: { type: Number, min: 1, max: 200 },
    hobbies: { type: [String], min: 1, max: 10 },
    address: AddressSchema,
    isActive: { type: Boolean, default: true },
    orders: [OrdersSchema]
  },
  { versionKey: false }
)

// Static Method Used To Generate userId if not provided in input
UserSchema.statics.generatedId = async function (gid) {
  try {
    const lastId = await User.findOne().sort('-userId').exec()
    /*  
    # !gid && !lastId
      If user not provided userId during update or creation
      and database have no user, then assigned 1 to that document
      which is goind to be created or updated.

    # !gid && lastId
      If userId not provided but database have users,
      Then sort database table/collection,
      After sorting, add 1 with userId of the last user in collection.

    # else block
      If userId provided, then cast that id for further safety.
    */
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

// Calculate Total Price of Orders
UserSchema.statics.generatedTotal = async function (userId) {
  try {
    const getResult = await User.aggregate([
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
    // getResult returns an array if order found,    [ { totalPrice: 91.94 } ]
    // so first index element selected                 { totalPrice: 91.94 }
    // if orders is empty then return [],
    // means user have not placed any order soundefined
    return getResult.length ? getResult[0] : getResult
  } catch (error) {
    return new Error('Can Not Generated ID')
  }
}

// Static Method To Check User Exist or Not
UserSchema.statics.isUserExist = async function (userId: number) {
  const isExist = await User.findOne({ userId })
  return isExist
}

// Hash password by bycrypt
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias, prefer-const
  let user = this
  const hash = await bcrypt.hashSync(user.password, Number(config.salt_rounds))
  // const hash = await passwordHash.generate(user.password)
  user.password = hash
  next()
})

/*
  - Post Middleware For After User Creation
  - Return data as Response by skipping some properties
*/
UserSchema.post('save', async function (docs, next) {
  docs.toJSON = function () {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, orders, _id, ...userWithoutOrders } = this.toObject()
    return userWithoutOrders
  }
  next()
})

// Model User
export const User = model<TUser, UserModel>('User', UserSchema)
