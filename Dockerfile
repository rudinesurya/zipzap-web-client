FROM node:18

WORKDIR /var/www/web-client

# Copy dependency definitions first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Run your development server
CMD ["npm", "run", "dev", "--", "--host"]