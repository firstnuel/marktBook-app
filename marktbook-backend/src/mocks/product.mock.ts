import { Response } from 'express'
import { IProductData } from '@inventory/interfaces/products.interface'
import { AuthPayload } from '@auth/interfaces/auth.interface'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const productMockRequest = (sessionData: IJWT, body: IProductMock, currentUser?: AuthPayload | null, params?: any) => ({
  session: sessionData,
  body,
  params,
  currentUser
})

export const productMockResponse = (): Response => {
  const res: Response = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

export interface IJWT {
    jwt?: string;
}

export type IProductMock =  
| IProductData
| EmptyData

export interface EmptyData {
  data?: string
}



