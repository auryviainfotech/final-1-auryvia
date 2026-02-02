/* ===============================
   CONTACT FORM BACKEND - Node.js + Express
   Handles form submissions and email sending
   =============================== */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'auryvia.infotech@gmail.com',
    pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Template for email to admin
const getAdminEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }
        .header { background: linear-gradient(135deg, #5865f2, #00cccc); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; font-size: 28px; font-weight: 600; margin-bottom: 8px; }
        .header p { color: rgba(255, 255, 255, 0.9); font-size: 14px; }
        .content { padding: 40px 30px; }
        .info-card { background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 20px; border-left: 4px solid #5865f2; }
        .info-row { display: flex; margin-bottom: 16px; }
        .info-row:last-child { margin-bottom: 0; }
        .info-label { font-weight: 600; color: #1a1a1a; min-width: 120px; font-size: 14px; }
        .info-value { color: #4a4a4a; font-size: 14px; flex: 1; word-break: break-word; }
        .message-box { background: #ffffff; border: 2px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-top: 20px; }
        .message-label { font-weight: 600; color: #1a1a1a; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .message-text { color: #4a4a4a; line-height: 1.7; font-size: 14px; white-space: pre-wrap; }
        .badge { display: inline-block; background: #e0e7ff; color: #5865f2; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; }
        .footer { background: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; }
        .footer p { font-size: 13px; color: #9c9c9c; margin-bottom: 8px; }
        .footer .company { font-weight: 600; color: #ffffff; font-size: 16px; margin-bottom: 12px; }
        @media (max-width: 600px) {
          .content { padding: 30px 20px; }
          .info-row { flex-direction: column; }
          .info-label { margin-bottom: 4px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 New Contact Form Submission</h1>
          <p>You have received a new message from your website</p>
        </div>
        
        <div class="content">
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${data.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${data.email}</span>
            </div>
            ${data.company ? `
            <div class="info-row">
              <span class="info-label">Company:</span>
              <span class="info-value">${data.company}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">Subject:</span>
              <span class="info-value">${data.subject}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div class="message-box">
            <div class="message-label">Message:</div>
            <div class="message-text">${data.message}</div>
          </div>
          
          ${data.newsletter ? '<span class="badge">✓ Subscribed to Newsletter</span>' : ''}
        </div>
        
        <div class="footer">
          <p class="company">Ayurvia Infotech</p>
          <p>This is an automated message from your contact form</p>
          <p style="margin-top: 12px; font-size: 12px;">Reply to this email to respond directly to ${data.name}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for confirmation email to sender
const getClientEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }
        .header { background: linear-gradient(135deg, #5865f2, #00cccc); padding: 50px 30px; text-align: center; }
        .success-icon { width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .success-icon svg { width: 40px; height: 40px; stroke: #ffffff; fill: none; }
        .header h1 { color: #ffffff; font-size: 32px; font-weight: 600; margin-bottom: 10px; }
        .header p { color: rgba(255, 255, 255, 0.95); font-size: 16px; line-height: 1.6; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #1a1a1a; margin-bottom: 20px; }
        .message { color: #4a4a4a; line-height: 1.8; font-size: 15px; margin-bottom: 30px; }
        .details-box { background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 2px solid #e5e5e5; }
        .details-title { font-weight: 600; color: #1a1a1a; margin-bottom: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .detail-row { margin-bottom: 12px; }
        .detail-label { color: #9c9c9c; font-size: 13px; margin-bottom: 4px; }
        .detail-value { color: #1a1a1a; font-size: 15px; }
        .newsletter-note { background: #e0e7ff; border-radius: 8px; padding: 16px; margin-top: 20px; display: flex; align-items: center; gap: 12px; }
        .newsletter-note svg { width: 24px; height: 24px; stroke: #5865f2; flex-shrink: 0; }
        .newsletter-note p { color: #5865f2; font-size: 14px; margin: 0; }
        .cta-button { display: inline-block; background: #5865f2; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin-top: 20px; transition: background 0.3s; }
        .cta-button:hover { background: #4752c4; }
        .footer { background: #1a1a1a; color: #ffffff; padding: 40px 30px; text-align: center; }
        .footer .logo { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
        .footer p { font-size: 14px; color: #9c9c9c; margin-bottom: 8px; line-height: 1.6; }
        .social-links { margin-top: 20px; display: flex; justify-content: center; gap: 12px; }
        .social-link { width: 40px; height: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; transition: background 0.3s; }
        .social-link:hover { background: #5865f2; }
        @media (max-width: 600px) {
          .header { padding: 40px 20px; }
          .content { padding: 30px 20px; }
          .header h1 { font-size: 26px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>Message Received!</h1>
          <p>Thank you for reaching out to us. We'll get back to you soon.</p>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${data.name},</div>
          
          <div class="message">
            We've successfully received your message and our team will review it shortly. We typically respond within 24 hours during business days. If your inquiry is urgent, feel free to call us directly.
          </div>
          
          <div class="details-box">
            <div class="details-title">Your Submission Details</div>
            <div class="detail-row">
              <div class="detail-label">Subject</div>
              <div class="detail-value">${data.subject}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Your Email</div>
              <div class="detail-value">${data.email}</div>
            </div>
            ${data.company ? `
            <div class="detail-row">
              <div class="detail-label">Company</div>
              <div class="detail-value">${data.company}</div>
            </div>
            ` : ''}
            <div class="detail-row">
              <div class="detail-label">Date Submitted</div>
              <div class="detail-value">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          
          ${data.newsletter ? `
          <div class="newsletter-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <p>You've been subscribed to our newsletter! You'll receive occasional updates about our services and industry insights.</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://auryvia.netlify.app/" class="cta-button">Visit Our Website</a>
          </div>
        </div>
        
        <div class="footer">
          <div class="logo">Ayurvia Infotech</div>
          <p>Crafting unforgettable digital experiences since 2005</p>
          <p style="margin-top: 16px;">
            📞 +91 97777 34444 | +91 72073 10635<br>
            📧 auryvia.infotech@gmail.com<br>
            📍 Road No 45, Jubilee Hills, Hyderabad, Telangana 500033
          </p>
          <div class="social-links">
            <a href="https://instagram.com" class="social-link">📷</a>
            <a href="https://linkedin.com" class="social-link">💼</a>
            <a href="https://twitter.com" class="social-link">🐦</a>
            <a href="https://facebook.com" class="social-link">👥</a>
          </div>
          <p style="margin-top: 20px; font-size: 12px;">
            © ${new Date().getFullYear()} Ayurvia Infotech. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// API endpoint for form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, subject, message, newsletter } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    const formData = {
      name,
      email,
      company: company || 'Not provided',
      subject,
      message,
      newsletter: newsletter || false
    };

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'auryvia.infotech@gmail.com',
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      html: getAdminEmailTemplate(formData)
    };

    // Confirmation email to sender
    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Ayurvia Infotech',
      html: getClientEmailTemplate(formData)
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);

    console.log('Emails sent successfully to:', email);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! Check your email for confirmation.',
      newsletter: newsletter || false
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Contact form server running on port ${PORT}`);
  console.log(`📧 Email notifications will be sent to: auryvia.infotech@gmail.com`);
});

module.exports = app;