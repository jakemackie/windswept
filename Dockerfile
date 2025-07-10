FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src

# Run prisma generate *after* copying source and prisma schema
RUN npx prisma generate

# Build Typescript inside image
RUN npm run build

# Use non-root user
USER node

CMD ["node", "dist/index.js"]
