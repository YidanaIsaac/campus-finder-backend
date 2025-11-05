#!/bin/bash

echo "📧 Email & Notification System Setup"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env 2>/dev/null || touch .env
fi

echo "Current email configuration:"
echo "----------------------------"
grep "^EMAIL_" .env 2>/dev/null || echo "(No email config found)"
echo ""

# Test MongoDB connection
echo "🔍 Checking MongoDB connection..."
if command -v mongo &> /dev/null || command -v mongosh &> /dev/null; then
    echo "✅ MongoDB client found"
else
    echo "⚠️  MongoDB client not found. Install MongoDB first."
fi

# Test if MongoDB is running
if nc -z localhost 27017 2>/dev/null; then
    echo "✅ MongoDB is running on port 27017"
else
    echo "❌ MongoDB is NOT running. Start it with:"
    echo "   brew services start mongodb-community"
    echo "   or: mongod"
fi
echo ""

# Check Node modules
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
    
    # Check for nodemailer
    if [ -d "node_modules/nodemailer" ]; then
        echo "✅ nodemailer installed"
    else
        echo "⚠️  nodemailer not found. Run: npm install nodemailer@7.0.9"
    fi
    
    # Check for socket.io
    if [ -d "node_modules/socket.io" ]; then
        echo "✅ socket.io installed"
    else
        echo "⚠️  socket.io not found. Run: npm install socket.io@4.8.1"
    fi
else
    echo "❌ node_modules not found. Run: npm install"
fi
echo ""

# Check service files
echo "📁 Checking service files..."
[ -f "src/services/emailService.js" ] && echo "✅ emailService.js" || echo "❌ emailService.js missing"
[ -f "src/services/matchingService.js" ] && echo "✅ matchingService.js" || echo "❌ matchingService.js missing"
[ -f "src/services/notificationService.js" ] && echo "✅ notificationService.js" || echo "❌ notificationService.js missing"
echo ""

echo "📋 Configuration Steps:"
echo "----------------------"
echo "1. Edit .env file and add:"
echo "   EMAIL_HOST=smtp.gmail.com"
echo "   EMAIL_PORT=587"
echo "   EMAIL_USER=your-email@gmail.com"
echo "   EMAIL_PASSWORD=your-app-specific-password"
echo "   EMAIL_FROM=\"Campus Finder <noreply@campusfinder.com>\""
echo "   FRONTEND_URL=http://localhost:5173"
echo ""
echo "2. For Gmail users:"
echo "   - Enable 2-Factor Authentication"
echo "   - Generate App Password at: https://myaccount.google.com/apppasswords"
echo "   - Use app password in EMAIL_PASSWORD"
echo ""
echo "3. Start MongoDB:"
echo "   brew services start mongodb-community"
echo ""
echo "4. Start server:"
echo "   npm run dev"
echo ""
echo "5. Test email (after server starts):"
echo "   npm run test:email your-email@example.com"
echo ""
echo "✅ Setup check complete!"
