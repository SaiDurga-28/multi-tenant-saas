#!/bin/sh

echo "Waiting for database..."
until pg_isready -h database -p 5432 -U postgres; do
  sleep 2
done

echo "Database is ready"

echo "Using SQL migrations and seed files"

echo "Starting backend..."
node src/app.js
