cat > README.md << 'EOF'
# Campus Finder Backend API

Node.js/Express backend for the Campus Finder Lost & Found system.

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Bcryptjs for password hashing

## API Endpoints

### Authentication
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user (protected)

### Lost Items
- POST /api/items/lost - Create lost item (protected)
- GET /api/items/lost - Get all lost items
- GET /api/items/lost/:id - Get single lost item
- PUT /api/items/lost/:id - Update lost item (protected)
- DELETE /api/items/lost/:id - Delete lost item (protected)

### Found Items
- POST /api/items/found - Create found item (protected)
- GET /api/items/found - Get all found items
- GET /api/items/found/:id - Get single found item
- PUT /api/items/found/:id - Update found item (protected)
- DELETE /api/items/found/:id - Delete found item (protected)
- PATCH /api/items/found/:id/claim - Claim found item (protected)

### User Items
- GET /api/items/user/items - Get user's items (protected)

## Getting Started
```bash
npm install
npm run dev
```

Server runs on port 5000.

## Environment Variables

See .env.example for required variables.

## Author

Yidana Isaac
EOF