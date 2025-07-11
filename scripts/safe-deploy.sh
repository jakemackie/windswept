#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting safe deployment process..."

# Create backups directory if it doesn't exist
mkdir -p ./backups

# Step 1: Create backup before any changes
echo "📦 Creating database backup..."
docker compose run --rm backup

# Step 2: Verify backup was created
BACKUP_FILE=$(ls -t ./backups/*.sql | head -1)
if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Backup creation failed!"
    exit 1
fi
echo "✅ Backup created: $BACKUP_FILE"

# Step 3: Run migrations
echo "🔄 Running database migrations..."
docker compose run --rm migrate

# Step 4: Verify migration success
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed! Rolling back..."
    echo "To restore from backup, run:"
    echo "docker compose exec db psql -U \$POSTGRES_USER -d \$POSTGRES_DB < $BACKUP_FILE"
    exit 1
fi

# Step 5: Generate Prisma client
echo "🔧 Generating Prisma client..."
docker compose run --rm generate

# Step 6: Start the application
echo "🚀 Starting application..."
docker compose up -d client

echo "✅ Safe deployment completed!"
echo "📊 Backup available at: $BACKUP_FILE" 