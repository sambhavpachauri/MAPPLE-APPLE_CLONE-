#!/bin/sh
set -e

echo "--- MAPPLE Production Backend Launch ---"

# Apply Alembic database migrations
if [ -f "alembic.ini" ]; then
    echo "Applying database schema migrations..."
    alembic upgrade head || echo "Alembic upgrade warning: Continuing with startup..."
fi

# Idempotently seed catalog, categories, demo accounts, and discount codes
echo "Ensuring catalog seed data is up to date..."
python seed.py

# Determine port from platform environment (Render, Railway, Heroku, etc.)
SERVER_PORT="${PORT:-8000}"
echo "Launching FastAPI server on 0.0.0.0:${SERVER_PORT}..."

exec uvicorn app.main:app --host 0.0.0.0 --port "$SERVER_PORT"
