FROM node:18

WORKDIR /app

# Install SQLite3
RUN apt-get update && apt-get install -y sqlite3

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy initialization files and create database
COPY init.sql ./
RUN sqlite3 northwind.db < init.sql

# Copy the rest of the application
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"] 