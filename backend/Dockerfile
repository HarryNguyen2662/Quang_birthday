
# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /backend

# Copy the application files into the working directory
COPY . /backend

# Install the application dependencies
RUN npm install

# Define the entry point for the container
CMD ["npm", "start"]
