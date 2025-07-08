FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm install prisma

COPY . .

RUN npm run build

USER node

CMD ["node", "dist/index.js"]
