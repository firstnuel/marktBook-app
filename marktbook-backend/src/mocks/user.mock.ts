import { Response } from 'express'
import { IuserData, IuserDocument } from '@users/interfaces/user.interface'
import { AuthPayload } from '@auth/interfaces/auth.interface'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userMockRequest = (sessionData: IJWT, body: IUsertMock, currentUser?: AuthPayload | null, params?: any) => ({
  session: sessionData,
  body,
  params,
  currentUser
})

export const userMockResponse = (): Response => {
  const res: Response = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

export interface IJWT {
    jwt?: string;
}

export type IUsertMock =  
    | IuserData
    | IuserDocument
    | NoData

export interface NoData {
  data?: object
}

