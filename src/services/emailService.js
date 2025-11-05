const sendEmail = require('../utils/sendEmail');

class EmailService {
  // Send welcome email
  async sendWelcomeEmail(user) {
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Campus Finder!</h1>
        </div>
        
        <div style="padding: 30px; background: #f7fafc;">
          <h2 style="color: #2d3748;">Hello ${user.name}! 👋</h2>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Thank you for joining Campus Finder - your trusted platform for finding lost items on campus.
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Your Account Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${user.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>ID Number:</strong> ${user.idNumber}</p>
            <p style="margin: 5px 0;"><strong>User Type:</strong> ${user.userType}</p>
          </div>
          
          <h3 style="color: #2d3748;">What You Can Do:</h3>
          <ul style="color: #4a5568; line-height: 1.8;">
            <li>📢 Report lost items</li>
            <li>🔍 Browse found items</li>
            <li>💬 Chat with item owners</li>
            <li>🔔 Get instant notifications</li>
            <li>📸 Upload item photos</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Get Started
            </a>
          </div>
          
          <p style="color: #718096; font-size: 14px; margin-top: 30px;">
            Need help? Contact us at support@campusfinder.com
          </p>
        </div>
        
        <div style="background: #2d3748; padding: 20px; text-align: center;">
          <p style="color: #a0aec0; margin: 0; font-size: 12px;">
            © 2025 Campus Finder. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return await sendEmail({
      email: user.email,
      subject: 'Welcome to Campus Finder! 🎉',
      message
    });
  }

  // Send item match notification
  async sendItemMatchNotification(user, item, matchType) {
    const itemType = item.status || matchType;
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${itemType === 'lost' ? '#f56565' : '#48bb78'}; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Possible Match Found! 🎯</h1>
        </div>
        
        <div style="padding: 30px; background: #f7fafc;">
          <h2 style="color: #2d3748;">Hi ${user.name},</h2>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Great news! We found a possible match for your ${itemType} item.
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid ${itemType === 'lost' ? '#f56565' : '#48bb78'};">
            <h3 style="color: #2d3748; margin-top: 0;">${item.itemName}</h3>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${item.category}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${item.location}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(item.dateLost || item.dateFound).toLocaleDateString()}</p>
            ${item.description ? `<p style="margin: 10px 0 5px 0;"><strong>Description:</strong></p><p style="color: #4a5568;">${item.description}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/item/${item._id}" 
               style="background: ${itemType === 'lost' ? '#f56565' : '#48bb78'}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              View Item Details
            </a>
          </div>
          
          <p style="color: #718096; font-size: 14px;">
            Please verify if this is your item by checking the details and contacting the poster.
          </p>
        </div>
        
        <div style="background: #2d3748; padding: 20px; text-align: center;">
          <p style="color: #a0aec0; margin: 0; font-size: 12px;">
            © 2025 Campus Finder. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return await sendEmail({
      email: user.email,
      subject: `Match Found: ${item.itemName}`,
      message
    });
  }

  // Send new message notification
  async sendNewMessageNotification(recipient, sender, item, messagePreview) {
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Message 💬</h1>
        </div>
        
        <div style="padding: 30px; background: #f7fafc;">
          <h2 style="color: #2d3748;">Hi ${recipient.name},</h2>
          
          <p style="color: #4a5568; line-height: 1.6;">
            You have a new message from <strong>${sender.name}</strong>:
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="color: #4a5568; font-style: italic;">"${messagePreview}"</p>
          </div>
          
          ${item ? `
            <div style="background: #edf2f7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #4a5568;"><strong>About:</strong> ${item.itemName}</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/chat" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Reply Now
            </a>
          </div>
        </div>
        
        <div style="background: #2d3748; padding: 20px; text-align: center;">
          <p style="color: #a0aec0; margin: 0; font-size: 12px;">
            © 2025 Campus Finder. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return await sendEmail({
      email: recipient.email,
      subject: `New message from ${sender.name}`,
      message
    });
  }

  // Send item claimed notification
  async sendItemClaimedNotification(user, item, claimedBy) {
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #48bb78; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Item Claimed! ✅</h1>
        </div>
        
        <div style="padding: 30px; background: #f7fafc;">
          <h2 style="color: #2d3748;">Hi ${user.name},</h2>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Good news! Someone has claimed your found item.
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">${item.itemName}</h3>
            <p style="margin: 5px 0;"><strong>Claimed by:</strong> ${claimedBy.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${claimedBy.email}</p>
            <p style="margin: 5px 0;"><strong>Contact:</strong> ${claimedBy.phone || 'Not provided'}</p>
          </div>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Please coordinate with the claimant to arrange a safe handover on campus.
          </p>
          
          <div style="background: #fff5f5; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #f56565;">
            <p style="margin: 0; color: #c53030; font-size: 14px;">
              <strong>⚠️ Safety Tip:</strong> Always meet in a public place and verify ownership before handing over the item.
            </p>
          </div>
        </div>
        
        <div style="background: #2d3748; padding: 20px; text-align: center;">
          <p style="color: #a0aec0; margin: 0; font-size: 12px;">
            © 2025 Campus Finder. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return await sendEmail({
      email: user.email,
      subject: `Item Claimed: ${item.itemName}`,
      message
    });
  }

  // Send password changed notification
  async sendPasswordChangedNotification(user) {
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ed8936; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Changed 🔒</h1>
        </div>
        
        <div style="padding: 30px; background: #f7fafc;">
          <h2 style="color: #2d3748;">Hi ${user.name},</h2>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Your Campus Finder password was successfully changed.
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Account:</strong> ${user.email}</p>
          </div>
          
          <div style="background: #fff5f5; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #f56565;">
            <p style="margin: 0; color: #c53030; font-size: 14px;">
              <strong>⚠️ Didn't make this change?</strong> Contact support immediately at support@campusfinder.com
            </p>
          </div>
        </div>
        
        <div style="background: #2d3748; padding: 20px; text-align: center;">
          <p style="color: #a0aec0; margin: 0; font-size: 12px;">
            © 2025 Campus Finder. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return await sendEmail({
      email: user.email,
      subject: 'Password Changed - Campus Finder',
      message
    });
  }
}

module.exports = new EmailService();
