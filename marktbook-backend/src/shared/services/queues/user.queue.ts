import { IUserJob } from '@root/features/users/interfaces/user.interface'
import { BaseQueue } from '@service/queues/base.queue'
import { userWorker } from '@worker/user.worker'


class UserQueue extends BaseQueue {
    constructor(){
        super('user')
        this.processJob('addUserToDb', 5, userWorker.addUserJob)
    }

    public addUserJob(name: string, data: IUserJob): void {
        this.addJob(name, data)
    }

}


export const userQueue: UserQueue = new UserQueue()