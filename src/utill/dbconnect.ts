/* eslint-disable no-console */
import mongoose from 'mongoose'
import config from '../app/config'

export const dbconnect = async (): Promise<void> => {
  if (!config.db) {
    console.log('Port Already Used or Not Found or Not Configured')
  }
  try {
    await mongoose.connect(config.db as string)
  } catch (error) {
    console.log('[Database Connection Problem] ', error)
  }
}
