#!/bin/bash

# Create app icon from emoji using built-in macOS tools
# This creates a simple icon that can be used for distribution

mkdir -p assets/icon.iconset

# Create different sizes for the icon
for size in 16 32 64 128 256 512 1024; do
    # Create a temporary HTML file to render the emoji
    cat > temp_icon.html << EOF
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .icon {
            font-size: $((size * 6 / 10))px;
            color: white;
        }
    </style>
</head>
<body>
    <div class="icon">📝</div>
</body>
</html>
EOF

    # Use webkit2png if available, otherwise create a simple PNG
    if command -v webkit2png &> /dev/null; then
        webkit2png --width=${size} --height=${size} --fullsize --delay=1 --output=assets/icon.iconset/icon_${size}x${size}.png file://$(pwd)/temp_icon.html
    else
        # Fallback: create a simple colored square with text
        sips -s format png --resampleHeightWidth ${size} ${size} /System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericDocumentIcon.icns --out assets/icon.iconset/icon_${size}x${size}.png 2>/dev/null || echo "Creating placeholder icon ${size}x${size}"
    fi
done

# Clean up
rm -f temp_icon.html

# Create the .icns file
if command -v iconutil &> /dev/null; then
    iconutil -c icns assets/icon.iconset -o assets/icon.icns
    echo "Created app icon at assets/icon.icns"
else
    echo "iconutil not found. Using default icon."
fi

# Clean up iconset directory
rm -rf assets/icon.iconset

echo "Icon creation complete!"
