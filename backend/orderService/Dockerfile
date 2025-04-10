# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5005 

# Start the service
CMD ["npm", "run", "start"]
