import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from the '.env' file
dotenv.config({
  path: path.join(process.cwd(), '.env')
})

const config = {
  port: process.env.PORT,
  db: process.env.DATABASE_URL,
  salt_rounds: process.env.SALT_ROUNDS
}

export default config
