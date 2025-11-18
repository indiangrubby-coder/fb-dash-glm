#!/bin/bash

# Facebook Ads Dashboard - Deployment Script for Vercel + Neon

echo "🚀 Facebook Ads Dashboard Deployment Setup"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if Prisma CLI is installed
if ! command -v prisma &> /dev/null; then
    echo "❌ Prisma CLI not found. Installing..."
    npm install -g prisma
fi

echo "✅ Dependencies checked"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Create a Neon database at https://neon.tech"
echo "2. Run the SQL script from neon/schema.sql in your Neon database"
echo "3. Set up environment variables in Vercel:"
echo "   - DATABASE_URL (your Neon connection string)"
echo "   - JWT_SECRET (secure random string)"
echo "   - APP_ENV=production"
echo "   - FACEBOOK_ACCESS_TOKEN (optional, for real Facebook data)"
echo "   - FACEBOOK_BUSINESS_ID (optional, for real Facebook data)"
echo ""
echo "4. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "🎉 Your Facebook Ads Dashboard will be live!"