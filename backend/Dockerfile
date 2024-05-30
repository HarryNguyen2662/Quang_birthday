
# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /backend

# Copy the application files into the working directory
COPY . /index.js

# Install the application dependencies
RUN yarn install

# Define the entry point for the container
CMD ["yarn", "start"]
