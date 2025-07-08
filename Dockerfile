FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm install prisma

COPY . .

RUN npx prisma generate

USER node

CMD ["node", "dist/index.js"]
