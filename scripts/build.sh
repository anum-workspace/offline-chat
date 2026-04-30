#!/bin/bash
set -e
echo "Building OfflineChat..."
cd frontend && npm install && npm run build
cd ../electron && npm install && npx electron-rebuild -f -w better-sqlite3
npx electron-builder --win
echo "Build complete! Check release/ folder."
