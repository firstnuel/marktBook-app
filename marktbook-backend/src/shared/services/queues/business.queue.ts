import { IBusinessJob } from '@business/interfaces/business.interface'
import { BaseQueue } from '@service/queues/base.queue'
import { businessWorker } from '@worker/business.worker'


class BusinessQueue extends BaseQueue {
    constructor(){
        super('business')
        this.processJob('addBusinessToDb', 5, businessWorker.addBusinessJob)
    }

    public addBusinessJob(name: string, data: IBusinessJob): void {
        this.addJob(name, data)
    }

}


export const businessQueue: BusinessQueue = new BusinessQueue()