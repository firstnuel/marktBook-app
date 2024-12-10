import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import { config } from '@root/config'

export const uploads = (
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> => {

  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      { 
        public_id, 
        overwrite, 
        invalidate, 
        folder: 'marktBook' 
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          resolve(error)
        }
        if (!result) {
          const resultError: UploadApiErrorResponse = {
            message: 'No result returned from Cloudinary.',
            name: 'UploadApiErrorResponse',
            http_code: 500
          }
           resolve(resultError)
        }
        resolve(result)
      }
    )
  })
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const constructCloudinaryURL = (uploadResult: any): string => {
  return `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${uploadResult.version}/${uploadResult.public_id}`
}


