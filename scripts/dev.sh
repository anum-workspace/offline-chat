#!/bin/bash
set -e
cd frontend && npm install && cd ../electron && npm install && cd ..
npx concurrently "cd frontend && npm run dev" "wait-on http://localhost:3000 && cd electron && npm run dev"
