#!/bin/bash

# =============================================================================
# Thumboard UI - Environment Setup Script
# =============================================================================
# This script helps set up environment variables for development

set -e

echo "🚀 Thumboard UI Environment Setup"
echo "=================================="

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Copy .env.example to .env.local
echo "📋 Copying .env.example to .env.local..."
cp .env.example .env.local

echo "✅ Environment file created!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local with your actual credentials:"
echo "   - Update MEILISEARCH_API_KEY if needed"
echo "   - Set SMTP_PASS with your Gmail app password"
echo "   - Update TURNSTILE_SECRET_KEY with your actual key"
echo ""
echo "2. Start the development server:"
echo "   pnpm dev"
echo ""
echo "📚 For more information, see ENVIRONMENT_SETUP.md"
echo ""
echo "🔧 To edit the environment file now:"
echo "   code .env.local"
echo "   # or"
echo "   nano .env.local"
