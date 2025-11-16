#!/bin/bash

echo "========================================="
echo "  E-Shop Android - Quick Run Script"
echo "========================================="
echo ""

# Navigate to frontend directory
cd /e/MINI\ PROJECT/ECommerceApp/frontend

echo "Step 1: Opening Android Studio..."
npx cap open android &

echo ""
echo "✅ Android Studio is opening..."
echo ""
echo "========================================="
echo "  What to do in Android Studio:"
echo "========================================="
echo ""
echo "1. ⏰ Wait for Gradle sync to finish (2-5 min)"
echo "   - Watch bottom status bar"
echo "   - You'll see 'Gradle sync finished'"
echo ""
echo "2. 📱 Create/Start Emulator:"
echo "   - Click Device Manager (phone icon)"
echo "   - Create Pixel 5 device if needed"
echo "   - Click Play button to start"
echo ""
echo "3. ▶️  Click the green Run button"
echo "   - App will build and install"
echo "   - E-Shop will launch on emulator"
echo ""
echo "========================================="
echo "  Backend Status"
echo "========================================="
echo ""
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "✅ Backend is running on port 5000"
else
    echo "❌ Backend is NOT running!"
    echo "   Start it with: cd backend && npm start"
fi
echo ""
echo "Press Ctrl+C to close this script"
echo ""
