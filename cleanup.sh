#!/bin/bash

# Portfolio Cleanup Script
# Removes unnecessary files and consolidates documentation

echo "🧹 Starting Portfolio Cleanup..."
echo ""

# Navigate to project root
cd /home/imran/Desktop/Portfolio

# Backup files to remove
echo "📦 Removing backup files..."
rm -f src/app/page.tsx.backup
rm -f backend/server.log
echo "✅ Backup files removed"
echo ""

# Remove redundant documentation (keeping only essential ones)
echo "📄 Removing redundant documentation files..."
DOCS_TO_REMOVE=(
    "BACKEND_INTEGRATION_COMPLETE.md"
    "BACKEND_URL_FIX.md"
    "CORS_FIX_FINAL.md"
    "CURSOR_UPDATE.md"
    "DEPLOYMENT_CHECKLIST.md"
    "DEPLOYMENT_GUIDE_2026.md"
    "DEPLOYMENT_TROUBLESHOOTING.md"
    "DEPLOYMENT.md"
    "EMAIL_DESIGN_IMPROVEMENTS.md"
    "EMAIL_UI_IMPROVEMENTS.md"
    "MOBILE_RESPONSIVE_UPDATE.md"
    "PRODUCTION_DEPLOYMENT_SUCCESS.md"
    "QUICK_DEPLOY.md"
    "RAILWAY_BACKEND_DOWN.md"
    "RAILWAY_CONFIG_FIX.md"
    "RAILWAY_SETUP_GUIDE.md"
    "RAILWAY_TRUST_PROXY_FIX.md"
    "RESPONSIVE_FIXES_DOCUMENTATION.md"
    "URGENT_FIX_DEPLOYED.md"
    "Profile.pdf"
)

for doc in "${DOCS_TO_REMOVE[@]}"; do
    if [ -f "$doc" ]; then
        rm -f "$doc"
        echo "  ❌ Removed: $doc"
    fi
done
echo "✅ Redundant documentation removed"
echo ""

# Remove .env examples (keeping only .env.example)
echo "🔐 Cleaning up environment files..."
rm -f .env.vercel-check
rm -f .env.local.example
echo "✅ Environment files cleaned"
echo ""

# Remove build artifacts if they exist
echo "🗑️  Cleaning build artifacts..."
rm -f tsconfig.tsbuildinfo
echo "✅ Build artifacts cleaned"
echo ""

# Summary
echo "════════════════════════════════════════"
echo "✨ Cleanup Complete!"
echo "════════════════════════════════════════"
echo ""
echo "📋 Remaining Documentation:"
echo "  ✓ README.md - Main project documentation"
echo "  ✓ RAILWAY_DEPLOYMENT_FIXED.md - Railway deployment guide"
echo "  ✓ FEATURES.md - Feature documentation"
echo "  ✓ HERO_SECTION_DOCS.md - Hero section docs"
echo "  ✓ TESTING_GUIDE.md - Testing instructions"
echo "  ✓ THREE_JS_FEATURES.md - Three.js features"
echo ""
echo "📁 Project Structure:"
echo "  ✓ backend/ - Backend server code"
echo "  ✓ src/ - Frontend source code"
echo "  ✓ public/ - Static assets"
echo "  ✓ blog/ - Blog content"
echo ""
echo "🎯 Next Steps:"
echo "  1. Review RAILWAY_DEPLOYMENT_FIXED.md"
echo "  2. Configure Railway environment variables"
echo "  3. Deploy to Railway"
echo "  4. Test contact form"
echo ""
