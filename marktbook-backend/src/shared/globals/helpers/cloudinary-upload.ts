import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

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
