import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { userRouters } from './app/modules/User/User.router'
import { dbconnect } from './utill/dbconnect'

const app: Application = express()

// This
app.use(express.json())
app.use(express.text())

// Middleware
  app.use(cors())

// dbconnect
dbconnect()

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log('Logger')
  next()
}

// Routers
app.use('/api', userRouters)

app.get('/', logger, (req: Request, res: Response) => {
  res.status(400).json({
    success: true,
    message: 'Welcome To Our Site'
  })
})

app.all('**', (req: Request, res: Response) => {
  res.status(200).json({
    success: false,
    message: 'Invalid URL'
  })
})

export default app
