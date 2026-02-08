#!/bin/bash

echo "=================================="
echo "🚀 Starting Backend Server..."
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please copy .env.example to .env and configure it"
    exit 1
fi

# Check if email is configured
if grep -q "YOUR_16_CHAR_APP_PASSWORD_HERE" .env; then
    echo "⚠️  WARNING: Email not configured yet!"
    echo ""
    echo "📧 To enable email functionality:"
    echo "   1. Go to: https://myaccount.google.com/apppasswords"
    echo "   2. Generate an App Password"
    echo "   3. Update EMAIL_PASS in .env file"
    echo ""
    echo "Press Ctrl+C to stop and configure, or wait 5 seconds to continue anyway..."
    sleep 5
fi

# Start the server
node server.js
