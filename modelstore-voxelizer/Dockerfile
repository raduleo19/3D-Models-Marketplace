# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Run the app when the container launches
CMD [ "node", "app.js" ]