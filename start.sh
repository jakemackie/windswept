#!/bin/bash

echo "🚀 Starting Windswept Discord Bot..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v doppler &> /dev/null; then
    echo "❌ Doppler is not installed. Please install Doppler first."
    exit 1
fi

echo "✅ All dependencies found!"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

if [ ! -d "node_modules/.prisma" ]; then
    echo "🔧 Generating Prisma client..."
    npm run db:generate
fi

echo "🔄 Starting development environment..."
npm run dev

echo "🎉 Windswept is now running!"