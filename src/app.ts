import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { userRouters } from './app/modules/User/User.router'
import { dbconnect } from './utill/dbconnect'

// Express instance
const app: Application = express()

// Middleware to handle JSON and text payloads
app.use(express.json())
app.use(express.text())

// CORS middleware for resource sharing
app.use(cors())

// Establishing a connection to the database
dbconnect()

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log('Logger')
  next()
}

// Routes for User module
app.use('/api', userRouters)

app.get('/', logger, (req: Request, res: Response) => {
  res.status(400).json({
    success: true,
    message: 'Welcome To Our Site'
  })
})

// Handling invalid URLs
app.all('**', (req: Request, res: Response) => {
  res.status(200).json({
    success: false,
    message: 'Invalid URL'
  })
})

// Exporting the configured Express application
export default app
