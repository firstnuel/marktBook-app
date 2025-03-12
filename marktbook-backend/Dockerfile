# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as needed
ARG NODE_VERSION=23.5.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Copy only essential files from the prebuilt CI artifact
COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json pm2.config.json fly.toml ./

# Expose port for the application
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
