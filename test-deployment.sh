#!/bin/bash

# Test Deployment Script
# This script tests your Railway backend deployment

RAILWAY_URL="https://portfolio-production-6468.up.railway.app"

echo "=================================="
echo "🧪 Testing Railway Deployment"
echo "=================================="
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Endpoint..."
echo "   GET $RAILWAY_URL/health"
curl -s "$RAILWAY_URL/health" | jq . || echo "❌ Health check failed"
echo ""
echo ""

# Test 2: Root Endpoint
echo "2️⃣  Testing Root Endpoint..."
echo "   GET $RAILWAY_URL/"
curl -s "$RAILWAY_URL/" | jq . || echo "❌ Root endpoint failed"
echo ""
echo ""

# Test 3: CORS Preflight (OPTIONS)
echo "3️⃣  Testing CORS Preflight..."
echo "   OPTIONS $RAILWAY_URL/api/contact"
curl -s -X OPTIONS "$RAILWAY_URL/api/contact" \
  -H "Origin: https://mdimran--portfolio.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  -v 2>&1 | grep -E "(< HTTP|< access-control)"
echo ""
echo ""

# Test 4: Contact Form Submission
echo "4️⃣  Testing Contact Form..."
echo "   POST $RAILWAY_URL/api/contact"
curl -s -X POST "$RAILWAY_URL/api/contact" \
  -H "Content-Type: application/json" \
  -H "Origin: https://mdimran--portfolio.vercel.app" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from deployment script"
  }' | jq . || echo "❌ Contact form test failed"
echo ""
echo ""

echo "=================================="
echo "✅ Testing Complete!"
echo "=================================="
echo ""
echo "If you see any errors, check:"
echo "1. Railway environment variables are set"
echo "2. Railway logs for server errors"
echo "3. Email configuration (EMAIL_USER, EMAIL_PASS)"
echo ""
