import bunyan from 'bunyan'
import dotenv from 'dotenv'
import cloudinary from 'cloudinary'

dotenv.config({})

class Config {
    public DATABASE_URI: string | undefined
    public JWT_SECRET: string | undefined
    public NODE_ENV: string | undefined
    public SECRET_KEY_ONE: string | undefined
    public SECRET_KEY_TWO: string | undefined
    public CLIENT_URL: string | undefined
    public CLOUD_NAME: string | undefined
    public CLOUD_API_KEY: string | undefined
    public CLOUD_API_SECRET: string | undefined


    constructor() {
        this.DATABASE_URI = process.env.DATABASE_URI
        this.JWT_SECRET = process.env.JWT_SECRET
        this.NODE_ENV = process.env.NODE_ENV
        this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE
        this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO
        this.CLIENT_URL = process.env.CLIENT_URL
        this.CLOUD_NAME = process.env.CLOUD_NAME
        this.CLOUD_API_KEY = process.env.CLOUD_API_KEY
        this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET
    }

    public createLogger(name: string): bunyan {
        return bunyan.createLogger({ name, level: 'debug' })
      }
    
    public validateConfig(): void {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
            throw new Error(`Configuration ${key} is undefined.`)
         }
        }
    }

    public cloudinaryConfig(): void {
        cloudinary.v2.config({
          cloud_name: this.CLOUD_NAME,
          api_key: this.CLOUD_API_KEY,
          api_secret: this.CLOUD_API_SECRET
        })
    }
}


export const config: Config = new Config