/* eslint-disable no-console */
import mongoose from 'mongoose'
import config from '../app/config'

export const dbconnect = async (): Promise<void> => {
  // Check Port
  if (!config.db) {
    console.log('Port Already Used or Not Found or Not Configured')
  }

  try {
    // Connect to the MongoDB database
    await mongoose.connect(config.db as string)
    console.log('Database Connected Successfully')
  } catch (error) {
    console.log('[Database Connection Problem] ', error)
  }
}
