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
    street: z.string({
      invalid_type_error: 'Expected Street, Received Only Number'
    }),
    city: z.string({
      invalid_type_error: 'Expected City, Received Only Number'
    }),
    country: z.string({
      invalid_type_error: 'Expected Country, Received Only Number'
    })
  })
  .refine(
    function (obj) {
      return (
        obj.city.length > 1 && obj.country.length > 1 && obj.street.length > 1
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
      .positive()
      .optional(),
    fullName: FullNameValidator,
    username: z
      .string({ invalid_type_error: 'User Name Should Not Be Only Digits!' })
      .min(2, 'User Name Missing or Too Much Short'),
    password: z
      .string({ invalid_type_error: 'Password Must Have Atleast One Letter' })
      .min(3, 'Password Must Be More Than Three Digits'),
    age: z
      .number({ invalid_type_error: 'Age Should Be Non-Zero Positive!' })
      .positive()
      .max(200, 'Age Should Be Below 200')
      .optional(),
    hobbies: z
      .string({ required_error: 'Hobbies Missing' })
      .array()
      .min(2, 'Add Minimum Two Hobbies')
      .max(10, 'You Can Only Add Ten Hobbies')
      .optional(),
    email: z
      .string({ invalid_type_error: 'Email Should Not Only Digits!' })
      .email({ message: 'Email Invalid' })
      .min(6, 'Too Much Short Email'),
    isActive: z.boolean().default(true),
    address: AddressValidator.optional(),
    orders: z.array(OrdersValidator).optional()
  })
  .strict()
