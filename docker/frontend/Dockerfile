# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:18
# Set the working directory inside the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./
# Install Node.js dependencies
RUN npm install
# Copy the application source code into the container
COPY . .
# Expose the port that the app will run on
EXPOSE 3000
# Start the application
CMD ["npm", "start"]