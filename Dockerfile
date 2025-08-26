FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma migrate dev

RUN npm run prisma:seed

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
