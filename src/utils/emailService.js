const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMatchNotification = async (userEmail, itemName, foundBy) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Possible Match Found! - ${itemName}`,
      html: `
        <h2>Great News!</h2>
        <p>Someone found an item that matches your lost report:</p>
        <h3>${itemName}</h3>
        <p>Found by: ${foundBy}</p>
        <p>Please log in to Campus Finder to see more details and contact them.</p>
        <a href="${process.env.FRONTEND_URL}">View on Campus Finder</a>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

const sendItemClaimedNotification = async (userEmail, itemName, claimedBy) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Your Found Item Was Claimed! - ${itemName}`,
      html: `
        <h2>Update on Your Found Item</h2>
        <p>Someone has claimed the item you reported finding:</p>
        <h3>${itemName}</h3>
        <p>Claimed by: ${claimedBy}</p>
        <p>Please log in to verify and complete the handoff.</p>
        <a href="${process.env.FRONTEND_URL}">View on Campus Finder</a>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

module.exports = { sendMatchNotification, sendItemClaimedNotification };
