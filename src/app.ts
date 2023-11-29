import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { dbconnect } from './utill/dbconnect'

const app: Application = express()

// Parser
app.use(express.json())
app.use(express.text())

// Middleware
app.use(cors())

// Database Connect
dbconnect()

const logger = (req: Request, res: Response, next: NextFunction) => {
  next()
}

app.get('/', logger, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Site Works Fine Now'
  })
})

app.all('**', (req: Request, res: Response) => {
  res.status(400).json({
    message: 'Unauthorized Action',
    success: false
  })
})

export default app
