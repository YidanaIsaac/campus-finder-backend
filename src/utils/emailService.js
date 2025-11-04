const nodemailer = require('nodemailer');

// Validate required environment variables
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'FRONTEND_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Missing email environment variables: ${missingEnvVars.join(', ')}`);
}

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // For development, set to true in production
  }
});

const sendMatchNotification = async (userEmail, itemName, foundBy, itemId = null) => {
  try {
    // Validate email
    if (!isValidEmail(userEmail)) {
      console.error('Invalid email address:', userEmail);
      return { success: false, error: 'Invalid email address' };
    }

    // Check if required environment variables are available
    if (missingEnvVars.length > 0) {
      console.error('Email service not configured properly');
      return { success: false, error: 'Email service not configured' };
    }

    const itemUrl = itemId ? `${process.env.FRONTEND_URL}/items/found/${itemId}` : process.env.FRONTEND_URL;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎉 Possible Match Found! - ${itemName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .item-name { color: #4CAF50; font-weight: bold; font-size: 18px; }
            .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Great News!</h1>
            </div>
            <div class="content">
              <p>Hello!</p>
              <p>Someone found an item that matches your lost report:</p>
              <p class="item-name">${itemName}</p>
              <p><strong>Found by:</strong> ${foundBy}</p>
              <p>Please log in to Campus Finder to see more details and contact them.</p>
              <a href="${itemUrl}" class="button">View Item Details</a>
              <p><small>If the button doesn't work, copy and paste this link: ${itemUrl}</small></p>
            </div>
            <div class="footer">
              <p>This is an automated message from Campus Finder. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Match notification sent to ${userEmail} for item: ${itemName}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error (match notification):', error);
    return { success: false, error: error.message };
  }
};

const sendItemClaimedNotification = async (userEmail, itemName, claimedBy, itemId = null) => {
  try {
    // Validate email
    if (!isValidEmail(userEmail)) {
      console.error('Invalid email address:', userEmail);
      return { success: false, error: 'Invalid email address' };
    }

    // Check if required environment variables are available
    if (missingEnvVars.length > 0) {
      console.error('Email service not configured properly');
      return { success: false, error: 'Email service not configured' };
    }

    const itemUrl = itemId ? `${process.env.FRONTEND_URL}/items/found/${itemId}` : process.env.FRONTEND_URL;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `📋 Your Found Item Was Claimed! - ${itemName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .item-name { color: #2196F3; font-weight: bold; font-size: 18px; }
            .button { display: inline-block; background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Update on Your Found Item</h1>
            </div>
            <div class="content">
              <p>Hello!</p>
              <p>Someone has claimed the item you reported finding:</p>
              <p class="item-name">${itemName}</p>
              <p><strong>Claimed by:</strong> ${claimedBy}</p>
              <p>Please log in to verify and complete the handoff. Make sure to verify their identity before handing over the item.</p>
              <a href="${itemUrl}" class="button">View Claim Details</a>
              <p><small>If the button doesn't work, copy and paste this link: ${itemUrl}</small></p>
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px;">
                <strong>⚠️ Safety Reminder:</strong> Meet in a public place and verify the claimer's identity before handing over the item.
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message from Campus Finder. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Item claimed notification sent to ${userEmail} for item: ${itemName}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error (item claimed notification):', error);
    return { success: false, error: error.message };
  }
};

// Test email connection
const testEmailConnection = async () => {
  try {
    if (missingEnvVars.length > 0) {
      console.warn('Cannot test email connection - missing environment variables:', missingEnvVars);
      return false;
    }
    
    await transporter.verify();
    console.log('Email service connected successfully');
    return true;
  } catch (error) {
    console.error('Email service connection failed:', error.message);
    return false;
  }
};

module.exports = { 
  sendMatchNotification, 
  sendItemClaimedNotification, 
  testEmailConnection,
  isValidEmail 
};
