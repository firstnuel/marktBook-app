import mongoose from 'mongoose'
import { config } from '@root/config'
import Logger from 'bunyan'
import { redisConnection } from '@service/redis/redis.connection'

const mongoUrl = config.DATABASE_URI!
const log: Logger = config.createLogger('setupDatabase')

export default () => {
    const connect = () => {
      mongoose
        .connect(mongoUrl)
        .then(() => {
          log.info('successfully connected to MongoDB.')
          redisConnection.connect()
        })
        .catch((error) => {
          log.error('error connecting to MongoDB:', error.message)
          return process.exit(1)
        })
    }
    connect()
  
    mongoose.connection.on('disconneted', connect)
  }