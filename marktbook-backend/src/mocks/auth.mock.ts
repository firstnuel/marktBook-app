import { Response } from 'express'
import { AuthPayload, BusinessCategory, BusinessType } from '@auth/interfaces/auth.interface'
import { ObjectId } from 'mongodb'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authMockRequest = (sessionData: IJWT, body: IAuthMock, currentUser?: AuthPayload | null, params?: any) => ({
  session: sessionData,
  body,
  params,
  currentUser
})

export const authMockResponse = (): Response => {
  const res: Response = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

export interface IJWT {
    jwt?: string;
}

export type IAuthMock = 
 | IRegisterMock 
 | ILoginMock 
 | ICurrentUserMock
 | IPasswordMock

export interface ICurrentUserMock {
  id?: object    
}

export interface IPasswordMock {
  email: string;
  password: string; 
}


export interface IRegisterMock {
    _id: ObjectId | string;
    uIds: {userUId: string, businessUId: string}; 
    email: string; 
    adminFullName: string; 
    username: string;
    password: string; 
    createdAt: Date | string;
    businessName: string;
    businessAddress?: string; 
    businessType: BusinessType; 
    businessCategory: BusinessCategory; 
    businessLogo?: string;
}

export interface ILoginMock {
  email: string; 
  username: string;
  password: string; 
}
  







