FROM node:18-alpine

WORKDIR /app

# Copy client files for build
COPY client ./client

# Build client with devDependencies
WORKDIR /app/client
RUN npm install --legacy-peer-deps
RUN npm run build

# Copy server files
COPY server ./server

# Debug: Verify server directory contents
RUN ls -la /app
RUN ls -la /app/server
RUN find /app -name package.json

# Install server dependencies
WORKDIR /app/server
RUN npm install --legacy-peer-deps --production

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start server
WORKDIR /app/server
CMD ["npm", "start"]
