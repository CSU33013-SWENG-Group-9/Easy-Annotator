# Pull from a base image
FROM node:12-alpine

# Copy the files from the current directory to app/
COPY . app/

# Use app/ as the working directory
WORKDIR app/

# Install dependencies (npm ci is similar to npm i, but for automated builds)
RUN npm ci --only-production

# Build production client side React application
RUN npm run build

# Listen on the specified port
EXPOSE 3000

# Set Node server
ENTRYPOINT npm run start