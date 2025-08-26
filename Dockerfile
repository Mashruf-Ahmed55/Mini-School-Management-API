FROM node:20-alpine


WORKDIR /app

COPY package*.json ./
RUN npm ci

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

# Check if pnpm-lock.yaml exists, if not use regular install
COPY pnpm-lock.yaml* ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

COPY . .
RUN npx prisma generate
RUN npm run prisma:seed

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
