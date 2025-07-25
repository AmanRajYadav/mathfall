#!/bin/bash

# MathFall Deployment Script for GitHub Pages
# This script builds the project and prepares it for deployment

echo "🚀 Starting MathFall deployment..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files are in the 'dist' directory"
    echo ""
    echo "🌐 To deploy to GitHub Pages:"
    echo "1. Go to your repository settings"
    echo "2. Navigate to Pages section"
    echo "3. Set source to 'Deploy from a branch'"
    echo "4. Select 'gh-pages' branch or '/docs' folder"
    echo "5. Set the folder to 'dist' (if using gh-pages branch)"
    echo ""
    echo "🔗 Your site will be available at: https://amanrajyadav.github.io/mathfall/"
else
    echo "❌ Build failed!"
    exit 1
fi 