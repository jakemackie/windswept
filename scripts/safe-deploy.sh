#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting safe deployment process..."

# Load environment variables from Doppler
if command -v doppler &> /dev/null; then
    echo "📡 Loading environment from Doppler..."
    eval $(doppler run --print-env)
else
    echo "⚠️  Doppler not found, using existing environment variables"
fi

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
if docker compose run --rm migrate; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Migration failed, attempting to resolve..."
    if [ -f "scripts/resolve-migration.sh" ]; then
        echo "🔧 Running migration resolution script..."
        chmod +x scripts/resolve-migration.sh
        ./scripts/resolve-migration.sh
        echo "🔄 Retrying migration..."
        if docker compose run --rm migrate; then
            echo "✅ Migration completed after resolution"
        else
            echo "❌ Migration still failed after resolution!"
            echo "To restore from backup, run:"
            echo "docker compose exec db psql -U \$POSTGRES_USER -d \$POSTGRES_DB < $BACKUP_FILE"
            exit 1
        fi
    else
        echo "❌ Migration failed and no resolution script available!"
        echo "To restore from backup, run:"
        echo "docker compose exec db psql -U \$POSTGRES_USER -d \$POSTGRES_DB < $BACKUP_FILE"
        exit 1
    fi
fi

# Step 5: Generate Prisma client
echo "🔧 Generating Prisma client..."
docker compose run --rm generate

# Step 6: Start the application
echo "🚀 Starting application..."
docker compose up -d client

echo "✅ Safe deployment completed!"
echo "📊 Backup available at: $BACKUP_FILE" 