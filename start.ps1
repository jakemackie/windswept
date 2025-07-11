#!/usr/bin/env pwsh

Write-Host "🚀 Starting Windswept Discord Bot..." -ForegroundColor Green

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

try {
    $dopplerVersion = doppler --version
    Write-Host "✅ Doppler found: $dopplerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Doppler is not installed. Please install Doppler first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ All dependencies found!" -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "node_modules/.prisma")) {
    Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
    npm run db:generate
}

Write-Host "🔄 Starting development environment..." -ForegroundColor Yellow
npm run dev

Write-Host "🎉 Windswept is now running!" -ForegroundColor Green