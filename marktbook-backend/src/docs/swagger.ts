import swaggerJsDoc, { Options } from 'swagger-jsdoc'
import { serve, setup } from 'swagger-ui-express'
import { Router } from 'express'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MarktBook API',
    version: '1.0.0',
    description: 'API documentation for MarktBook.',
  },
  servers: [
    {
      url: 'http://localhost:5001/api/v1',
      description: 'Development server',
    },
  ],
}

const swaggerOptions: Options = {
  definition: swaggerDefinition,
  apis: ['./src/docs/**/*.yaml', './src/routes/**/*.ts'], 
}

const swaggerSpec = swaggerJsDoc(swaggerOptions)

// Create a router to serve Swagger
const swaggerRouter = Router()
swaggerRouter.use('/api-docs', serve, setup(swaggerSpec))

export { swaggerRouter, swaggerSpec }
