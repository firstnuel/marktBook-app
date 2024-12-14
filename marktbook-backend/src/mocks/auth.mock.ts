import { Response } from 'express'
import { AuthPayload, BusinessCategory, BusinessType, IAuthDocument } from '@auth/interfaces/auth.interface'
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


export interface IAuthMock {
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
  

export const authUserPayload: AuthPayload = {
  userId: '60263f14648fed5246e322d9',
  businessId: '60265f14648fed5246e322da',
  uId: {userUId: '1621613119252066', businessUId: '1621614119252766'},
  username: 'Manny',
  email: 'manny@me.com',
  iat: 12345
}

export const authMock = {
  _id: '60263f14648fed5246e322d3',
  uIds: {userUId: '1621613119252066', businessUId: '1621614119252766'},
  username: 'Manny',
  adminFullName: 'Manny David',
  businessName: 'Tech Innovations LLC',
  email: 'manny@me.com',
  createdAt: '2022-08-31T07:42:24.451Z',
  businessType: 'Retail',
  businessCategory: 'Technology',
  save: () => {},
  comparePassword: () => false
} as unknown as IAuthDocument





