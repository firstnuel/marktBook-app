FROM node:22-alpine

WORKDIR /app

# Copy only package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production

# Copy prebuilt files (excluding unnecessary ones)
COPY dist ./dist
COPY pm2.config.json ./

EXPOSE 3000

CMD ["npm", "run", "start"]
