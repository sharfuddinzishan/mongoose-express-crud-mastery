import express from 'express'
import { userControllers } from './User.controller'

const router = express.Router()

router.post('/users', userControllers.createUserController)
router.get('/users', userControllers.getUsersController)
router.get('/users/:userId', userControllers.getUserByIdController)
router.put('/users/:userId', userControllers.updateUserByIdController)
router.delete('/users/:userId', userControllers.deleteUserByIdController)

export const userRouters = router
