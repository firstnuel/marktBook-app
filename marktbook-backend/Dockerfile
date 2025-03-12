# syntax = docker/dockerfile:1

# Use a lightweight Node.js base image
ARG NODE_VERSION=23.5.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Set working directory
WORKDIR /app

# Install pm2 globally in the container
RUN npm install -g pm2

# Set production environment
ENV NODE_ENV="production"

# Copy built files and dependencies from the deploy artifact
COPY deploy/dist ./dist
COPY deploy/package.json deploy/pm2.config.json deploy/fly.toml ./

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
