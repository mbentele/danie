#!/bin/bash

# Setup script for local danie.de development environment

echo "🚀 Setting up local development environment for danie.de..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION found. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
fi

echo ""
echo "🔧 Configuration needed:"
echo "1. Edit .env.local and add your DATABASE_URL from Replit"
echo "2. Optionally add OPENAI_API_KEY for KI features"
echo ""
echo "📝 To get DATABASE_URL from Replit:"
echo "   1. Go to your Replit project"
echo "   2. Go to Database tab"
echo "   3. Copy the DATABASE_URL from Secrets"
echo ""

# Check if DATABASE_URL is set
if grep -q "postgresql://username:password" .env.local; then
    echo "⚠️  Please update DATABASE_URL in .env.local before starting development"
else
    echo "✅ DATABASE_URL appears to be configured"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with real DATABASE_URL"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "Development commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run db:push      - Push schema to database"
echo "  npm run db:studio    - Open database GUI"
echo ""