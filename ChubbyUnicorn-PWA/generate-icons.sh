#!/bin/bash

# This script generates PWA icons from the iOS app icon
# It creates 192x192 and 512x512 versions needed for PWA

echo "Generating PWA icons from iOS app icon..."

# Source icon from iOS project
SOURCE_ICON="/Users/maorboker/Documents/chubby-unicorn-ios/Unicorn/Assets.xcassets/AppIcon.appiconset/1024.png"

# Check if source exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo "Source icon not found at: $SOURCE_ICON"
    echo "Using fallback icon generation..."
    
    # Create simple placeholder icons if source not found
    # You'll need to replace these with actual icons
    echo "Creating placeholder icons..."
    
    # Create a simple SVG as placeholder
    cat > icon-192.svg << 'EOF'
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#3b82f6"/>
  <text x="96" y="96" font-family="Arial" font-size="144" fill="white" text-anchor="middle" dominant-baseline="middle">🦄</text>
</svg>
EOF
    
    cat > icon-512.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#3b82f6"/>
  <text x="256" y="256" font-family="Arial" font-size="384" fill="white" text-anchor="middle" dominant-baseline="middle">🦄</text>
</svg>
EOF
    
    echo "Created placeholder SVG icons"
    echo "Please replace icon-192.svg and icon-512.svg with actual PNG icons"
else
    # If ImageMagick is installed, resize the icons
    if command -v convert &> /dev/null; then
        convert "$SOURCE_ICON" -resize 192x192 icon-192.png
        convert "$SOURCE_ICON" -resize 512x512 icon-512.png
        echo "✅ Icons generated successfully!"
    else
        # Just copy the source icon
        cp "$SOURCE_ICON" icon-192.png
        cp "$SOURCE_ICON" icon-512.png
        echo "⚠️  ImageMagick not found. Copied original icon."
        echo "Install ImageMagick for proper resizing: brew install imagemagick"
    fi
fi

echo "PWA icons ready in public directory!"