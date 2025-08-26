FROM node:20-alpine

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci

# Copy rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN npm run build

EXPOSE 3000

# CMD: run migrations, seed, then start app
CMD npx prisma migrate deploy && npm run prisma:seed && npm run start:prod
