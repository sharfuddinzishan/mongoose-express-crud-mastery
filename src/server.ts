/* eslint-disable no-console */
import app from './app'
import config from './app/config'

async function bootstrap() {
  try {
    app.listen(config.port || 4000, () => {
      console.log(`Server Listened at Port ${config.port || 4000}`)
    })
  } catch (err) {
    new Error('Server Not Start')
  }
}

bootstrap()
