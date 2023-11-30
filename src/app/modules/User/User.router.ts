import express from 'express'
import { userControllers } from './User.controller'

const router = express.Router()

router.post('/users', userControllers.createUserController)
router.get('/users', userControllers.getUsersController)

export const userRouters = router
