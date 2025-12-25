#!/bin/sh

echo "Waiting for database..."
until pg_isready -h database -p 5432 -U postgres; do
  sleep 2
done

echo "Database is ready"

echo "Running migrations..."
npm run migrate

echo "SQL seed files will be loaded via database initialization"

echo "Starting backend..."
node src/app.js
