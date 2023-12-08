# Use the Node.js slim image as the base
FROM node:slim

# Set the working directory inside the container
WORKDIR /app

# Copy the entire current directory into the container at /app
COPY . /app

# Install dependencies
RUN npm install

# Expose port 3000 (the port your app runs on)
EXPOSE 3000

# Define environment variables (example variables)
ENV PORT = 3030
ENV TWILIO_ACCOUNT_SID = AC470acc82887eaad86c5b51bb8e9b95d2
ENV TWILIO_AUTH_TOKEN = 666bb90f86592e8fd188bb40681b763c
ENV SERCRET_KEY = AC470acc82887eaad86c5b51bb8e9b95d2666bb90f86592e8fd188bb40681b763c

# Specify the command to run your app using Node.js
CMD ["node", "app.js"]
