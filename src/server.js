const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const { testEmailConnection } = require('./utils/emailService');

dotenv.config();
connectDB();

// Test email connection on startup
testEmailConnection().then(success => {
  if (success) {
    console.log('✅ Email service is ready');
  } else {
    console.log('⚠️ Email service not configured or failed to connect');
  }
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(compression());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('join', (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`👤 User ${userId} joined`);
  });

  socket.on('disconnect', () => {
    Object.keys(connectedUsers).forEach(key => {
      if (connectedUsers[key] === socket.id) {
        delete connectedUsers[key];
      }
    });
    console.log('❌ Client disconnected');
  });
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  next();
});

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const supportRoutes = require('./routes/supportRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const emailRoutes = require('./routes/emailRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎉 Campus Finder API is running!',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      items: '/api/items',
      notifications: '/api/notifications',
      support: '/api/support',
      upload: '/api/upload'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   Campus Finder API v2.0 - LEGENDARY MODE`);
  console.log('🚀 ========================================');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Security: ✅ Helmet + Rate Limiting`);
  console.log(`⚡ Performance: ✅ Compression`);
  console.log(`🔌 WebSocket: ✅ Socket.IO`);
  console.log('========================================\n');
});

process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
