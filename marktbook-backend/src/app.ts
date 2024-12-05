import { MarktBookServer } from './setupServer'
import express, { Express } from 'express'

class App {
    public initialize(): void {
    //   this.loadConfig()
    //   databaseConnection()
      const app: Express = express()
      const server: MarktBookServer = new MarktBookServer(app)
      server.start()
    }
  
    // private loadConfig(): void {
    //   config.validateConfig()
    //   config.cloudinaryConfig()
    // }
  }
  
  const app: App = new App()
  app.initialize()