#!/bin/sh
set -e

echo "Running migrations..."
npx prisma migrate deploy --schema=src/infrastructure/database/prisma/schema.prisma

echo "Starting server..."
exec node dist/index.js