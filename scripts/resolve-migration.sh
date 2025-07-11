#!/bin/bash

set -e

echo "🔍 Checking migration state..."

# Load environment variables from Doppler
if command -v doppler &> /dev/null; then
    echo "📡 Loading environment from Doppler..."
    eval $(doppler run --print-env)
else
    echo "⚠️  Doppler not found, using existing environment variables"
fi

# Check if the created_at column already exists
echo "Checking if created_at column exists in Record table..."
docker compose exec db psql -U $POSTGRES_USER -d $POSTGRES_DB -c "\d \"Record\"" | grep -q "created_at" && {
    echo "✅ created_at column already exists"
    echo "Resolving failed migration..."
    docker compose exec db psql -U $POSTGRES_USER -d $POSTGRES_DB -c "UPDATE \"_prisma_migrations\" SET finished_at = NOW() WHERE migration_name = '20250710175702_add_created_at_column';"
    echo "✅ Migration marked as completed"
} || {
    echo "❌ created_at column does not exist"
    echo "Applying migration manually..."
    docker compose exec db psql -U $POSTGRES_USER -d $POSTGRES_DB -c "ALTER TABLE \"Record\" ADD COLUMN \"created_at\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;"
    docker compose exec db psql -U $POSTGRES_USER -d $POSTGRES_DB -c "UPDATE \"_prisma_migrations\" SET finished_at = NOW() WHERE migration_name = '20250710175702_add_created_at_column';"
    echo "✅ Migration applied and marked as completed"
}

echo "🎉 Migration issue resolved!" 