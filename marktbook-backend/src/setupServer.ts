import compression from 'compression'
import cookieSession from 'cookie-session'
import { Application, json, urlencoded } from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import http from 'http'
import cors from 'cors'
import { config } from './config'
import Logger from 'bunyan'

const log: Logger = config.createLogger('server')

const PORT = 5001

export class MarktBookServer {
    private readonly app: Application

    constructor(app: Application) {
        this.app = app
    }

    public start(): void {
        this.securityMiddleware(this.app)
        this.standardMiddleware(this.app)
        // this.routesMiddleware(this.app)
        // this.globalErrorHandler(this.app)
        this.startServer(this.app)
      }

    private standardMiddleware(app: Application): void {
        app.use(compression())
        app.use(json({ limit: '50mb' }))
        app.use(urlencoded({ extended: true, limit: '50mb' }))
    }
    private securityMiddleware(app: Application): void {
        app.use(
            cookieSession({
              name: 'session',
              keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
              maxAge: 24 * 7 * 3600000,
              secure: config.NODE_ENV != 'development'
            })
          )
          app.use(helmet())
          app.use(hpp())
          app.use(
            cors({
              origin: config.CLIENT_URL,
              credentials: true,
              optionsSuccessStatus: 200,
              methods: ['GET', 'PUT', 'DELETE', 'POST', 'OPTIONS']
            })
          )
    }

    // private globalErrorHandler(app: Application): void {}

    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app)
            // const socketIo: Server = await this.createSocketIO(httpServer)
            this.startHttpServer(httpServer)
            // this.socketIoConnections(socketIo)
          } catch (error) {
            log.error(error)
          }
    }
    // private async createSocketIO(httpServer: http.Server): Promise<Server> {}


    private startHttpServer(httpServer: http.Server): void {
    //    log.info(`server started with process ${process.pid}`)
        httpServer.listen(PORT, () => {
            log.info(`Server running on ${PORT}`)
        })
    }


}
