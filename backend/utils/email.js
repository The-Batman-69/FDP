const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP configuration missing. Skipping email send.');
    return { sent: false, reason: 'smtp_not_configured' };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      attachments
    });
    return { sent: true };
  } catch (error) {
    console.error('Email send failed:', error.message);
    return { sent: false, reason: 'smtp_error', error: error.message };
  }
};

module.exports = { sendEmail };
