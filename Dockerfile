FROM node:20-alpine

WORKDIR /app

# Copy package files and lockfile
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies using npm ci
RUN npm ci

COPY . .

# Generate Prisma client (build-time operation)
RUN npx prisma generate

RUN npx prisma migrate deploy

RUN npm run prisma:seed

# Build the application
RUN npm run build

EXPOSE 3000

# Run migrations, seed, and start application at runtime
CMD ["sh", "-c", "npm run start:prod"]
