#!/bin/bash
# Build script - builds React frontend then starts Python backend
# Railway runs this automatically

echo "=== Installing frontend dependencies ==="
cd frontend
npm install --legacy-peer-deps

echo "=== Building React frontend ==="
npm run build
cd ..

echo "=== Starting backend server ==="
cd backend
uvicorn server:app --host 0.0.0.0 --port $PORT
