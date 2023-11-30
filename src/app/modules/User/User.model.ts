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
    return getResult.length ? getResult[0] : getResult
  } catch (error) {
    return new Error('Can Not Generated ID')
  }
}

// Static Method To Check User Exist or Not
UserSchema.statics.isUserExist = async function (userId: number) {
  const isExist = await User.findOne({ userId })
  console.log(isExist)
  return isExist
}

/*
  - Post Middleware For After User Creation
  - Return data as Response by skipping some properties
*/
UserSchema.post('save', async function (docs, next) {
  docs.toJSON = function () {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, orders, ...userWithoutOrders } = this.toObject()
    return userWithoutOrders
  }
  next()
})

// Model User
export const User = model<TUser, UserModel>('User', UserSchema)
