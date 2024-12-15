import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import { config } from '@root/config'
import { ProductImage } from '@inventory/interfaces/products.interface'

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

export async function uploadProductImages(
  productImages: ProductImage[], 

): Promise<ProductImage[] | Error> {
  if (!productImages || !productImages.length) {
    return []
  }

  try {
    const uploadPromises = productImages.map(async (imageObj) => {
      try {
        const uploadResult = await uploads(
          imageObj.url
        )
        
        if (!uploadResult?.public_id) {
          log.error(`Product image upload failed for URL: ${imageObj.url}`)
          return new Error(`File Error: Failed to upload product image for URL: ${imageObj.url}`)
        }
        
        log.info(`Product image uploaded successfully: ${uploadResult.public_id}`)
        
        return {
          ...imageObj,
          url: constructCloudinaryURL(uploadResult)
        }
      } catch (uploadError) {
        console.error(`Failed to upload image: ${imageObj.url}`, uploadError)
        return new Error(`Upload error for URL: ${imageObj.url}`)
      }
    })

    // Settle all promises, handling both successful uploads and errors
    const uploadResults = await Promise.all(uploadPromises)
    
    // Filter out errors
    const successfulUploads = uploadResults.filter(result => 
      !(result instanceof Error)
    ) as ProductImage[]

    // If all uploads failed, return an error
    if (successfulUploads.length === 0) {
      const errorMessages = uploadResults
        .filter(result => result instanceof Error)
        .map(error => (error as Error).message)
        .join('; ')
      
      return new Error(`All image uploads failed: ${errorMessages}`)
    }

    // Return successful uploads
    return successfulUploads
  } catch (error) {
    log.error('Unexpected error in uploadProductImages', error)
    return error instanceof Error 
      ? error 
      : new Error('An unexpected error occurred during image uploads')
  }
}