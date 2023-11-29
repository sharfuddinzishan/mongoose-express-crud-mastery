import express from 'express'
import { userControllers } from './User.controller'

const router = express.Router()

router.post('/create-user', userControllers.createUserController)

export const userRouters = router
