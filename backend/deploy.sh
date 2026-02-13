#!/bin/bash

# Backend Deployment Script for Vercel
# This script deploys the portfolio backend to Vercel

echo "🚀 Starting Backend Deployment to Vercel..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found!"
    exit 1
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "⚠️  Don't forget to set your environment variables:"
echo "   - EMAIL_USER (your Gmail address)"
echo "   - EMAIL_PASS (your Gmail App Password)"
echo "   - FRONTEND_URL (your frontend deployment URL)"
echo ""
echo "Run these commands to add them:"
echo "   vercel env add EMAIL_USER"
echo "   vercel env add EMAIL_PASS"
echo "   vercel env add FRONTEND_URL"
echo ""
echo "Then redeploy with: vercel --prod"
