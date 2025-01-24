import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import { config } from '@root/config'
import { BadRequestError } from '@global/helpers/error-handlers'
import { Utils } from '@global/helpers/utils'

const log = config.createLogger('cloudinaryUploads')

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
      } ,
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
// https://res.cloudinary.com/demo/image/upload/e_background_removal/docs/rmv_bgd/dog_couch_orig

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const constructCloudinaryURL = (uploadResult: any): string => {
  return `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${uploadResult.version}/${uploadResult.public_id}`
}


export async function singleImageUpload(image: string, id: string): Promise<string | undefined> {
  if (Utils.isValidImage(image)) {
    const uploadResult = await uploads(image, id, true, true)
    if (!uploadResult?.public_id) {
      throw new BadRequestError('File Error: Failed to upload profile picture')
    }
    log.info(`Profile picture uploaded successfully: ${uploadResult.public_id}`)
    return constructCloudinaryURL(uploadResult)
  }
  return undefined
}
