import Logger from 'bunyan'
import { config } from '@root/config'
import { Basecache } from '@service/redis/base.cache'

const log: Logger = config.createLogger('redisConnection')

class RedisConnection extends Basecache {
    constructor() {
        super('redisConnection')
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect()
            const res = await this.client.ping()
            log.info(`${res}, Redis is up and running`)
        } catch (error) {
            log.error(error)
        }
    }
}

export const redisConnection: RedisConnection = new RedisConnection()