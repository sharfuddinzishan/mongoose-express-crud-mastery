import { z } from 'zod'

const OrdersValidator = z.object({
  productName: z
    .string({
      invalid_type_error: 'Expected Product Name, Received Only Number'
    })
    .min(2, 'Product Name Missing or Too Short'),
  price: z
    .number({ invalid_type_error: 'Price Should Be Number' })
    .positive({ message: 'Price Should Not Zero Or Less' }),
  quantity: z
    .number({ invalid_type_error: 'Quantity Should Be Number' })
    .positive({ message: 'Quantity Should Not Zero Or Less' })
})

const AddressValidator = z
  .object({
    street: z
      .string({ invalid_type_error: 'Expected Street, Received Only Number' })
      .length(3, 'Too Much Short Street'),
    city: z
      .string({ invalid_type_error: 'Expected City, Received Only Number' })
      .length(3, 'Too Much Short City'),
    country: z
      .string({ invalid_type_error: 'Expected Country, Received Only Number' })
      .length(3, 'Too Much Short Country')
  })
  .refine(
    function (obj) {
      return (
        obj.city.length > 3 && obj.country.length > 3 && obj.street.length > 3
      )
    },
    { message: 'City/Street/Country Wrong Input' }
  )

const FullNameValidator = z.object({
  firstName: z
    .string({
      invalid_type_error: 'Expected First Name But Received Only Number'
    })
    .min(2, 'First Name Too Much Short')
    .max(50, 'First Name Length Limit Exceed'),
  lastName: z
    .string({
      invalid_type_error: 'Expected First Name But Received Only Number'
    })
    .min(2, 'First Name Too Much Short')
    .max(50, 'First Name Length Limit Exceed')
})

export const UserZodValidator = z
  .object({
    userId: z
      .number({
        required_error: 'User ID Missing',
        invalid_type_error: 'Expected User Id, But Received Only Number'
      })
      .positive(),
    fullName: FullNameValidator.required(),
    email: z
      .string({ invalid_type_error: 'Email Should Not Only Digits!' })
      .email({ message: 'Email Invalid' })
      .min(6, 'Too Much Short Email'),
    userName: z
      .string({ invalid_type_error: 'User Name Should Not Be Only Digits!' })
      .min(2, 'User Name Missing or Too Much Short'),
    password: z
      .string({ invalid_type_error: 'Check Password Type String or Not' })
      .min(3, 'Password Must Be More Than Four Digits'),
    age: z
      .number({ invalid_type_error: 'Age Should Be Non-Zero Positive!' })
      .positive()
      .optional(),
    hobbies: z
      .string()
      .array()
      .min(2, 'Add Minimum Two Hobbies')
      .max(10, 'You Can Only Add Ten Hobbies'),
    address: AddressValidator.optional(),
    isActive: z.boolean().default(true),
    orders: z.array(OrdersValidator).optional()
  })
  .strict()
