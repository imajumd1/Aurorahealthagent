#!/bin/bash
cd "/Users/ishitamajumdar/Desktop/Cursor project/Healthagent"

echo "🔍 Aurora Server Startup Script"
echo "================================"
echo ""

# Kill any existing processes
echo "Cleaning up any existing processes..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f nodemon 2>/dev/null
sleep 1

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your OPENAI_API_KEY"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "❌ Error: node_modules not found!"
    echo "Running npm install..."
    npm install
fi

echo "Starting Aurora server..."
echo "Port: 3002"
echo "Press Ctrl+C to stop"
echo ""

# Start the server with explicit port
PORT=3002 NODE_ENV=development node server.js
