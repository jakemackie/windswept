# Assuming you're using a multi-stage Docker build
FROM node:20 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema before running generate
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of your app
COPY . .

# Build your app (if using TypeScript or bundling)
RUN npm run build

# Start from a clean image if needed, or use the same one
FROM node:20
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

# Make sure .prisma/client exists
CMD ["node", "dist/index.js"]
