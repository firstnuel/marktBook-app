import { DoneCallback, Job } from 'bull'
import Logger from 'bunyan'
import { config } from '@root/config'
import { businessService } from '@service/db/business.service'




const log: Logger = config.createLogger('businessWorker')


class BusinessWorker {
    async addBusinessJob(job: Job, done: DoneCallback): Promise<void> {

      try {
        const { value } = job.data
        await businessService.addBusinessData(value)
        job.progress(100)
        done(null, job.data)

      } catch(error) {
        log.error(error)
        done(error as Error)

      }
    }
}

export const businessWorker: BusinessWorker = new BusinessWorker()