const getEmailTemplate = (type, data) => {
  const baseStyles = `
    font-family: 'Helvetica Neue', Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  `;

  const templates = {
    // Password Reset Email
    passwordReset: `
      <div style="${baseStyles}">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Reset</h1>
          <p style="color: #e0e7ff; margin-top: 10px;">Campus Finder</p>
        </div>
        
        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Hello,
          </p>
          
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            You requested to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
            Or copy and paste this link into your browser:
          </p>
          
          <p style="font-size: 14px; color: #2563eb; word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 6px;">
            ${data.resetUrl}
          </p>
          
          <div style="margin-top: 30px; padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
            <p style="font-size: 14px; color: #92400e; margin: 0;">
              ⚠️ This link will expire in 1 hour.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            If you didn't request this, please ignore this email or contact support if you have concerns.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            © 2025 Campus Finder. All rights reserved.
          </p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">
            Find what's lost, return what's found
          </p>
        </div>
      </div>
    `,

    // Item Match Found
    itemMatch: `
      <div style="${baseStyles}">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Match Found!</h1>
          <p style="color: #d1fae5; margin-top: 10px;">Campus Finder</p>
        </div>
        
        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Hello ${data.userName},
          </p>
          
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Great news! We found a potential match for your ${data.itemType} item:
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 12px 0; font-size: 18px;">${data.itemName}</h3>
            <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">
              📍 Location: ${data.location}
            </p>
            <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">
              📅 Date: ${data.date}
            </p>
            ${data.description ? `
              <p style="color: #6b7280; margin: 12px 0 0 0; font-size: 14px;">
                ${data.description}
              </p>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.itemUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              View Item Details
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            Click the button above to view more details and contact the person who posted this item.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            © 2025 Campus Finder. All rights reserved.
          </p>
        </div>
      </div>
    `,

    // New Message
    newMessage: `
      <div style="${baseStyles}">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">💬 New Message</h1>
          <p style="color: #ede9fe; margin-top: 10px;">Campus Finder</p>
        </div>
        
        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Hello ${data.receiverName},
          </p>
          
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            You have a new message from <strong>${data.senderName}</strong>:
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
            <p style="color: #374151; margin: 0; font-size: 15px; font-style: italic;">
              "${data.message}"
            </p>
          </div>
          
          ${data.itemName ? `
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
              Regarding: <strong>${data.itemName}</strong>
            </p>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.chatUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Reply Now
            </a>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            © 2025 Campus Finder. All rights reserved.
          </p>
        </div>
      </div>
    `,

    // Item Claimed
    itemClaimed: `
      <div style="${baseStyles}">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✅ Item Claimed</h1>
          <p style="color: #d1fae5; margin-top: 10px;">Campus Finder</p>
        </div>
        
        <div style="padding: 40px 20px;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Hello ${data.userName},
          </p>
          
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Your found item has been claimed:
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 12px 0; font-size: 18px;">${data.itemName}</h3>
            <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">
              Claimed by: ${data.claimedBy}
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            Thank you for helping reunite items with their owners! 🙏
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            © 2025 Campus Finder. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  return templates[type] || '';
};

module.exports = { getEmailTemplate };
