#!/bin/bash
# ============================================
# ShopNest Setup Script
# ============================================

echo ""
echo "🛒 ShopNest MERN eCommerce Setup"
echo "================================="
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd server
npm install
echo "✅ Backend deps installed"

# Create .env from example
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "⚠️  Created server/.env — please fill in your credentials!"
fi

cd ..

# Frontend setup
echo ""
echo "🎨 Installing frontend dependencies..."
cd client
npm install
echo "✅ Frontend deps installed"

# Create .env from example
if [ ! -f ".env" ]; then
  echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
  echo "✅ Created client/.env"
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📌 Next steps:"
echo "   1. Fill in server/.env with your MongoDB URI, JWT secret, and Cloudinary keys"
echo "   2. cd server && npm run dev"
echo "   3. cd client && npm start"
echo ""
echo "🌐 App will run at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000/api"
echo ""
