const morgan = require('morgan');
const logger = require('../config/logger');

// Custom Morgan token for user ID
morgan.token('user-id', (req) => {
  return req.user ? req.user.id : 'anonymous';
});

// Custom Morgan token for user type
morgan.token('user-type', (req) => {
  return req.user ? req.user.userType : 'none';
});

// Custom format for Morgan
const morganFormat = ':remote-addr - :user-id [:user-type] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"';

// Skip logging for health check and favicon
const skipRoutes = (req, res) => {
  return req.url === '/health' || req.url === '/favicon.ico';
};

// Morgan middleware
const morganMiddleware = morgan(morganFormat, {
  stream: logger.stream,
  skip: skipRoutes
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  logger.info(`Incoming Request: ${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user ? req.user.id : 'anonymous'
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel](`Response: ${req.method} ${req.url} ${res.statusCode}`, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user ? req.user.id : 'anonymous'
    });
  });

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    error: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user ? req.user.id : 'anonymous',
    body: req.body
  });
  
  next(err);
};

module.exports = {
  morganMiddleware,
  requestLogger,
  errorLogger
};
