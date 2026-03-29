#!/bin/bash

# Resume Analyzer - Quick Start Script
# This script automates the setup for Mac/Linux users

set -e  # Exit on error

echo "🚀 Resume Analyzer - Quick Setup"
echo "=================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please download from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo "✅ npm $(npm --version) found"
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p resume-analyzer/{backend,frontend}
cd resume-analyzer

# Setup Backend
echo ""
echo "🔧 Setting up backend..."
cd backend

# Create package.json
cat > package.json << 'EOF'
{
  "name": "resume-analyzer-backend",
  "version": "1.0.0",
  "description": "Resume analyzer backend with Claude API integration",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.3",
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.6.0"
  }
}
EOF

# Create .env template
cat > .env.example << 'EOF'
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
PORT=5000
NODE_ENV=development
EOF

echo "📦 Installing backend dependencies..."
npm install

echo "✅ Backend setup complete"
echo ""
echo "⚠️  Please add your Anthropic API key to .env:"
echo "   cp .env.example .env"
echo "   nano .env  # Edit and add your key"
echo ""

# Setup Frontend
cd ../frontend

# Create package.json
cat > package.json << 'EOF'
{
  "name": "resume-analyzer-frontend",
  "version": "1.0.0",
  "description": "Resume analyzer frontend with React",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
EOF

# Create src directory
mkdir -p src

echo "🎨 Creating frontend configuration files..."

# Create vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
})
EOF

# Create tailwind.config.js
cat > tailwind.config.js << 'EOF'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Create postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resume Analyzer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# Create index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo "📦 Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete"
echo ""

# Summary
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Add your API key to backend/.env:"
echo "    cd backend"
echo "    cp .env.example .env"
echo "    nano .env  # Add your ANTHROPIC_API_KEY"
echo ""
echo "2️⃣  Copy the provided source files:"
echo "    - Copy server.js to backend/"
echo "    - Copy frontend.jsx to frontend/src/App.jsx"
echo "    - Copy main.jsx to frontend/src/"
echo ""
echo "3️⃣  Start the backend (Terminal 1):"
echo "    cd backend && npm start"
echo ""
echo "4️⃣  Start the frontend (Terminal 2):"
echo "    cd frontend && npm run dev"
echo ""
echo "5️⃣  Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🚀"
