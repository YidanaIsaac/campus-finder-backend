# Email Service Documentation

## Overview
The Campus Finder email service provides automated email notifications for users when:
- Potential matches are found between lost and found items
- Items are claimed by other users

## Features Fixed/Added

### ✅ Issues Fixed:
1. **Error Handling**: Added proper error handling with return values
2. **Email Validation**: Added email address validation
3. **Environment Variables**: Added validation for required environment variables
4. **Security**: Improved transporter configuration with proper TLS settings
5. **Integration**: Connected email service to item controllers
6. **Professional Templates**: Enhanced HTML email templates with modern styling

### ✅ New Features:
1. **Automatic Matching**: When a lost/found item is posted, the system automatically searches for potential matches and sends notifications
2. **Claim Notifications**: Users receive emails when their found items are claimed
3. **Email Testing**: Added API endpoints to test email functionality
4. **Connection Testing**: Server tests email connection on startup

## Environment Variables Required

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Test Email Connection
```
GET /api/email/test-connection
Authorization: Bearer <token>
```

### Send Test Email
```
POST /api/email/test-send
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "match", // or "claimed"
  "email": "test@example.com",
  "itemName": "Test Item"
}
```

## Automatic Notifications

### Match Notifications
- Triggered when a new lost/found item is posted
- Uses intelligent matching algorithm considering:
  - Category (exact match required)
  - Item name similarity (40 points)
  - Location similarity (20 points)
  - Color match (10 points)
  - Brand match (15 points)
  - Date proximity within 7 days (10 points)
- Minimum score of 60 points required for notification

### Claim Notifications
- Triggered when someone claims a found item
- Notifies the original finder
- Includes safety reminder about meeting in public places

## Email Templates

All emails include:
- Professional HTML styling
- Responsive design
- Clear call-to-action buttons
- Safety reminders where appropriate
- Direct links to relevant items/pages

## Error Handling

The email service gracefully handles:
- Invalid email addresses
- Missing environment variables
- SMTP connection failures
- Network timeouts

Errors are logged but don't interrupt the main application flow.

## For Frontend Integration

The frontend should handle these scenarios:
1. **Email notifications are optional** - app works without email configuration
2. **Match notifications** - users should see a badge/notification when potential matches are found
3. **Claim workflows** - provide clear UI for claiming items and verification process
4. **Email preferences** - allow users to opt in/out of email notifications

## Security Considerations

1. **Email validation** prevents sending to invalid addresses
2. **Rate limiting** should be implemented for email endpoints
3. **Authentication required** for all email testing endpoints
4. **Environment variables** should never be exposed to frontend
5. **TLS encryption** used for SMTP connections
