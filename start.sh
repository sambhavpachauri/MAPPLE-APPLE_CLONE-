#!/usr/bin/env bash
set -e

# Mapple Full-Stack Development Startup Script
echo "=================================================="
echo " Starting MAPPLE Full-Stack Application"
echo "=================================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Setup backend
echo "-> Starting Backend API server on http://localhost:8000..."
cd "$ROOT_DIR/backend"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt
fi

# Ensure database is seeded
./venv/bin/python seed.py

# Launch backend in background
./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "Backend running (PID: $BACKEND_PID)"

# 2. Setup frontend
echo "-> Starting Frontend Vite server on http://localhost:5173..."
cd "$ROOT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    npm install
fi

# Trap to kill backend on exit
trap "kill $BACKEND_PID 2>/dev/null || true; exit" SIGINT SIGTERM EXIT

npm run dev -- --host 0.0.0.0 --port 5173
