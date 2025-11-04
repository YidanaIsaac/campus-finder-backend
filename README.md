# 🎓 Campus Finder Backend API - LEGENDARY v2.0

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-orange)

A robust, production-ready backend API for the Campus Lost & Found system with smart email notifications and real-time features.

> 🔗 **Frontend Repository**: [campus-finder-frontend](https://github.com/YidanaIsaac/campus-finder-frontend)

## 🌟 **LEGENDARY Features**

### Security
- ✅ **Helmet** - Security headers
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Input Validation** - Joi schema validation
- ✅ **CORS** - Configured cross-origin requests

### Performance
- ✅ **Compression** - Gzip compression
- ✅ **Database Indexes** - Optimized queries
- ✅ **Pagination** - Efficient data loading
- ✅ **Caching Ready** - Structure for Redis integration

### Features
- ✅ **Real-time Updates** - Socket.IO integration
- ✅ **File Upload** - Cloudinary integration
- ✅ **Email Service** - Nodemailer support
- ✅ **Error Handling** - Centralized error management
- ✅ **API Documentation** - Clear endpoint structure

## 📋 Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.x
- npm or yarn

## 🔧 Installation

```bash
cd campus-finder-backend
npm install
```

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🏃 Running the Server

```bash
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/profile-image` - Upload profile image
- `GET /api/auth/stats` - Get user statistics

### Lost Items
- `GET /api/items/lost` - Get all lost items (with pagination)
- `POST /api/items/lost` - Create lost item report
- `GET /api/items/lost/:id` - Get single lost item
- `PUT /api/items/lost/:id` - Update lost item
- `DELETE /api/items/lost/:id` - Delete lost item

### Found Items
- `GET /api/items/found` - Get all found items (with pagination)
- `POST /api/items/found` - Create found item report
- `GET /api/items/found/:id` - Get single found item
- `PUT /api/items/found/:id` - Update found item
- `DELETE /api/items/found/:id` - Delete found item
- `PUT /api/items/found/:id/claim` - Claim found item

### User Items
- `GET /api/items/user` - Get current user's items

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read

### Support
- `POST /api/support` - Send support message

## 🔐 Authentication

All protected routes require Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Response Format

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🛡️ Security Features

1. **Rate Limiting**
   - Auth endpoints: 10 requests per 15 minutes
   - API endpoints: 100 requests per 15 minutes

2. **Validation**
   - Request body validation with Joi
   - Email format validation
   - Password strength requirements (min 6 chars)

3. **Error Handling**
   - Centralized error handler
   - Custom error classes
   - Production-safe error messages

## 📈 Database Indexes

Optimized queries with indexes on:
- User: email, idNumber
- Items: userId, category, status, location, dates
- Text search: itemName, description

## 🚦 Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## 🔄 Pagination

```
GET /api/items/lost?page=1&limit=20&sort=-createdAt
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (default: -createdAt)
- `category`: Filter by category
- `location`: Filter by location
- `search`: Search in name and description

## 🧪 Testing

```bash
npm test
```

## 📦 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Configure MongoDB Atlas
4. Set up Cloudinary
5. Configure email service
6. Enable HTTPS
7. Set up process manager (PM2)

## 🤝 Integration with Frontend

The backend is fully integrated with the React frontend at:
- Development: http://localhost:5173
- Production: Configure in FRONTEND_URL

## 📝 License

MIT

## 👨‍💻 Author

Campus Finder Team - Legendary Mode 🔥
