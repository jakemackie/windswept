FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy prisma schema first
COPY prisma ./prisma/
RUN npx prisma generate

# Then copy the rest of the app
COPY . .

# Use non-root user
USER node

CMD ["node", "dist/index.js"]
