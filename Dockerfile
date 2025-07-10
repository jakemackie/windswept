FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm install prisma

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

USER node

CMD ["node", "dist/index.js"]
