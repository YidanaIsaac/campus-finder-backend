const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campus Finder API',
      version: '2.0.0',
      description: 'API documentation for Campus Finder - A lost and found management system',
      contact: {
        name: 'Campus Finder Team',
        email: 'support@campusfinder.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.campusfinder.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            idNumber: { type: 'string', example: 'STU12345' },
            userType: { 
              type: 'string', 
              enum: ['student', 'staff', 'security', 'visitor'],
              example: 'student'
            },
            phone: { type: 'string', example: '+1234567890' },
            department: { type: 'string', example: 'Computer Science' },
            avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Item: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Blue Backpack' },
            category: { 
              type: 'string',
              enum: ['Electronics', 'Clothing', 'Accessories', 'Books', 'Keys', 'IDs', 'Other'],
              example: 'Accessories'
            },
            description: { type: 'string', example: 'Blue backpack with laptop compartment' },
            location: { type: 'string', example: 'Library 3rd Floor' },
            dateReported: { type: 'string', format: 'date-time' },
            status: { 
              type: 'string',
              enum: ['active', 'claimed', 'resolved'],
              example: 'active'
            },
            images: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://example.com/image1.jpg']
            },
            reporter: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' }
              }
            },
            type: {
              type: 'string',
              enum: ['lost', 'found'],
              example: 'lost'
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            user: { type: 'string', example: '507f1f77bcf86cd799439011' },
            type: {
              type: 'string',
              enum: ['match', 'claim', 'message', 'system'],
              example: 'match'
            },
            title: { type: 'string', example: 'Potential Match Found' },
            message: { type: 'string', example: 'We found an item that matches your report' },
            read: { type: 'boolean', example: false },
            relatedItem: { type: 'string', example: '507f1f77bcf86cd799439011' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string', example: 'Detailed error information' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
