FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

# Check if pnpm-lock.yaml exists, if not use regular install
COPY pnpm-lock.yaml* ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Run Prisma seed script before building
RUN pnpm run prisma:seed

# Build the application
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
