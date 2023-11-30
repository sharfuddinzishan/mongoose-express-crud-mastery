import express from 'express'
import { userControllers } from './User.controller'

const router = express.Router()

router.post('/users', userControllers.createUserController)
router.get('/users', userControllers.getUsersController)
router.get('/users/:userId', userControllers.getUserByIdController)

export const userRouters = router
