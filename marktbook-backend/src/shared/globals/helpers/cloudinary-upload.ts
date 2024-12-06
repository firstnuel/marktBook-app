import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

export const uploads = (
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      { public_id, overwrite, invalidate, folder: 'marktBook' },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`))
        }
        if (!result) {
          return reject(new Error('No result returned from Cloudinary.'))
        }
        resolve(result)
      }
    )
  })
}