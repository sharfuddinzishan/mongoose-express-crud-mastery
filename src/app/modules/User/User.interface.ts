export type TOrders = {
  productName: string
  price: number
  quantity: number
}
export type TUser = {
  userId: number
  fullName: {
    firstName: string
    lastName: string
  }
  email: string
  username: string
  password: string
  age: number
  hobbies: string[]
  address: {
    street: string
    city: string
    country: string
  }
  isActive: boolean
  orders: TOrders
}
