#!/bin/bash

# Deploy Mission Control Dashboard to Vercel
# Usage: ./deploy.sh [vercel|netlify|railway]

PLATFORM=${1:-vercel}

echo "🚀 Deploying Mission Control Dashboard to $PLATFORM..."

case $PLATFORM in
  vercel)
    if ! command -v vercel &> /dev/null; then
      echo "Installing Vercel CLI..."
      npm i -g vercel
    fi
    echo "Building for production..."
    npm run build
    echo "Deploying to Vercel..."
    vercel --prod
    ;;
  netlify)
    if ! command -v netlify &> /dev/null; then
      echo "Installing Netlify CLI..."
      npm i -g netlify-cli
    fi
    echo "Building for production..."
    npm run build
    echo "Deploying to Netlify..."
    netlify deploy --prod --dir=dist
    ;;
  railway)
    if ! command -v railway &> /dev/null; then
      echo "Installing Railway CLI..."
      npm i -g @railway/cli
    fi
    echo "Deploying to Railway..."
    railway up
    ;;
  *)
    echo "Unknown platform: $PLATFORM"
    echo "Usage: ./deploy.sh [vercel|netlify|railway]"
    exit 1
    ;;
esac

echo "✅ Deployment complete!"