FROM node:22-alpine

WORKDIR /app

# Install frontend dependencies and build
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Install server dependencies
RUN npm ci --prefix server

EXPOSE 3001

CMD ["node", "server/index.js"]
