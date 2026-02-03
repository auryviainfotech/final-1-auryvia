/* ===============================
   SERVER.JS - WITH EMAIL ALERTS
   =============================== */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 

// --- 1. MONGODB CONNECTION (deployment-friendly: retry + longer timeout) ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auryvia';
const isAtlas = MONGO_URI.includes('mongodb+srv');
const isDeployment = !!process.env.PORT || process.env.RENDER || process.env.VERCEL;

// Deployment: need longer timeout (cold start, DNS). Atlas often needs 15–20s.
const serverSelectionTimeoutMS = isAtlas || isDeployment ? 20000 : 5000;
const mongooseOptions = {
  serverSelectionTimeoutMS,
  socketTimeoutMS: 45000,
  retryWrites: true,
  maxPoolSize: 10,
};

if (isDeployment && (!process.env.MONGO_URI || process.env.MONGO_URI === 'mongodb://localhost:27017/auryvia')) {
  console.warn('⚠️  MONGO_URI not set in deployment. Set MONGO_URI in Render Dashboard → Environment.');
}

function connectMongo() {
  return mongoose.connect(MONGO_URI, mongooseOptions)
    .then(() => {
      console.log('✅ Connected to MongoDB successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);
    })
    .catch(err => {
      throw err;
    });
}

// Retry connection (helps on Render/Atlas cold start and network delays)
const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 3000;

function connectMongoWithRetry(retriesLeft = MAX_RETRIES) {
  connectMongo()
    .catch(err => {
      console.error(`❌ MongoDB connection failed (${MAX_RETRIES - retriesLeft + 1}/${MAX_RETRIES}):`, err.message);
      if (retriesLeft <= 1) {
        console.log('⚠️  Server will run without database. Set MONGO_URI and allow 0.0.0.0/0 in Atlas Network Access.');
        return;
      }
      console.log(`🔄 Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      setTimeout(() => connectMongoWithRetry(retriesLeft - 1), RETRY_DELAY_MS);
    });
}

connectMongoWithRetry();

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

// --- 2. EMAIL CONFIGURATION (BREVO FIXED) ---
// Check if email credentials are configured
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

if (!EMAIL_USER || !EMAIL_PASSWORD || EMAIL_USER === 'your_brevo_smtp_user' || EMAIL_PASSWORD === 'your_brevo_smtp_password') {
    console.warn('⚠️  WARNING: Email credentials not configured properly in .env file');
    console.warn('   Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
    console.warn('   Email notifications will not work until credentials are set');
}

// Use Gmail SMTP by default, or use SMTP_SERVER from .env if set
const SMTP_SERVER = process.env.SMTP_SERVER || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');

// Website URL for user and admin emails
const WEBSITE_URL = 'https://auryviainfotech.com';

const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify email configuration on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Email configuration error:', error.message);
        console.error('   Please check your EMAIL_USER and EMAIL_PASSWORD in .env file');
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// Python email sender function
function sendEmailViaPython(action, ...args) {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, 'send_email.py');
        
        // Check if Python script exists
        if (!fs.existsSync(pythonScript)) {
            console.error('❌ Python email script not found:', pythonScript);
            reject(new Error('Python script not found'));
            return;
        }
        
        // Escape arguments for command line
        const escapedArgs = args.map(arg => 
            `"${String(arg).replace(/"/g, '\\"')}"`
        ).join(' ');
        
        // Try python3 first, then python (for cross-platform compatibility)
        const pythonCommands = process.platform === 'win32' 
            ? ['python', 'python3', 'py'] 
            : ['python3', 'python'];
        
        let commandIndex = 0;
        
        const tryPythonCommand = () => {
            if (commandIndex >= pythonCommands.length) {
                reject(new Error('Python not found. Please install Python 3.'));
                return;
            }
            
            const pythonCmd = pythonCommands[commandIndex];
            const command = `${pythonCmd} "${pythonScript}" ${action} ${escapedArgs}`;
            
            console.log(`🐍 Trying Python command: ${pythonCmd} (attempt ${commandIndex + 1}/${pythonCommands.length})`);
            
            exec(command, { 
                env: { ...process.env, EMAIL_USER, EMAIL_PASSWORD, SMTP_SERVER: process.env.SMTP_SERVER || 'smtp.gmail.com', SMTP_PORT: process.env.SMTP_PORT || '587' },
                maxBuffer: 1024 * 1024 * 10 // 10MB buffer
            }, (error, stdout, stderr) => {
                if (error) {
                    // Try next Python command
                    if (commandIndex < pythonCommands.length - 1) {
                        commandIndex++;
                        tryPythonCommand();
                    } else {
                        console.error('❌ Python email error:', error.message);
                        if (stderr) console.error('   stderr:', stderr);
                        reject(error);
                    }
                    return;
                }
                
                if (stdout.includes('SUCCESS')) {
                    console.log('✅ Python email sent successfully!');
                    resolve(true);
                } else if (stdout.includes('ERROR')) {
                    console.error('❌ Python email failed:', stdout);
                    reject(new Error(stdout));
                } else {
                    console.log('📧 Python email output:', stdout);
                    resolve(true);
                }
            });
        };
        
        tryPythonCommand();
    });
}

// Email notification functions - Try Node.js first (works on Render), then Python as fallback
async function sendEmailAlert(subject, text) {
    if (EMAIL_USER && EMAIL_PASSWORD && EMAIL_USER !== 'your_brevo_smtp_user' && EMAIL_PASSWORD !== 'your_brevo_smtp_password') {
        try {
            const mailOptions = {
                from: `"Auryvia Notification" <${EMAIL_USER}>`,
                to: "auryvia.infotech@gmail.com",
                subject: `🔔 ${subject}`,
                text: text + `\n\nOpen admin panel: ${WEBSITE_URL}`
            };
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to auryvia.infotech@gmail.com! ID: ${info.messageId}`);
            return;
        } catch (error) {
            console.log('⚠️  Node.js email failed:', error.message, '- trying Python...');
        }
    }
    try {
        await sendEmailViaPython('alert', subject, text);
    } catch (pythonError) {
        if (!EMAIL_USER || !EMAIL_PASSWORD) console.error('❌ Cannot send email: Set EMAIL_USER and EMAIL_PASSWORD in Render Environment.');
    }
}

// Send email to admin when user sends message (only if admin is offline)
async function sendUserMessageEmailToAdmin(chat, message) {
    const userName = chat.name || 'Guest';
    const userEmail = chat.email || '';
    const adminEmail = 'auryvia.infotech@gmail.com';

    console.log(`📧 Attempting to send email to admin: ${adminEmail}`);
    console.log(`   User: ${userName}, Email: ${userEmail}, Message: ${message.substring(0, 50)}...`);

    // Try Node.js first (works on Render without Python/dotenv)
    if (EMAIL_USER && EMAIL_PASSWORD && EMAIL_USER !== 'your_brevo_smtp_user' && EMAIL_PASSWORD !== 'your_brevo_smtp_password' && EMAIL_USER.includes('@')) {
        try {
            const mailOptions = {
                from: `"Auryvia Chat" <${EMAIL_USER}>`,
            to: adminEmail,
            subject: `💬 New Message from ${userName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; border-bottom: 2px solid #5865f2; padding-bottom: 10px;">New Chat Message</h2>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>From:</strong> ${userName}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail || 'No email provided'}</p>
                    </div>
                    <div style="background: #fff; padding: 15px; border-left: 4px solid #5865f2; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
                    </div>
                    <p style="color: #666; font-size: 14px; margin-top: 20px;">Reply to this user through the admin panel when you're online.</p>
                    <p style="margin-top: 15px;"><a href="${WEBSITE_URL}" style="color: #5865f2; font-weight: 600;">Open admin panel → ${WEBSITE_URL}</a></p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">This is an automated notification from Auryvia Chat System.</p>
                </div>
            `,
            text: `
New Chat Message

From: ${userName}
Email: ${userEmail || 'No email provided'}

Message:
${message}

Reply to this user through the admin panel when you're online.
Open admin panel: ${WEBSITE_URL}
            `
            };
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to ${adminEmail}!`);
            console.log(`   Message ID: ${info.messageId}`);
            return;
        } catch (error) {
            console.log('⚠️  Node.js email failed:', error.message, '- trying Python...');
        }
    }

    try {
        await sendEmailViaPython('user_message', userName, userEmail, message);
        console.log('✅ Python email sent successfully!');
    } catch (pythonError) {
        if (!EMAIL_USER || !EMAIL_PASSWORD) {
            console.error('❌ Cannot send email: Set EMAIL_USER and EMAIL_PASSWORD in Render Environment.');
        }
    }
}

// Send email to user when admin replies (only if user is offline)
async function sendAdminReplyEmailToUser(chat, message) {
    if (!chat.email) {
        console.log('⚠️  Cannot send email: User has no email address');
        return;
    }

    const userName = chat.name || 'there';
    const userEmail = chat.email;

    // Try Node.js first (works on Render without Python/dotenv)
    if (EMAIL_USER && EMAIL_PASSWORD && EMAIL_USER !== 'your_brevo_smtp_user' && EMAIL_PASSWORD !== 'your_brevo_smtp_password') {
        try {
            const mailOptions = {
                from: `"Auryvia Support" <${EMAIL_USER}>`,
                to: userEmail,
                subject: `Re: Your Message - Auryvia Support`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Reply from Auryvia Support</h2>
                        <p>Hi ${userName},</p>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; font-size: 16px; line-height: 1.6;">${message}</p>
                        </div>
                        <p style="color: #666; font-size: 14px;">You can continue the conversation by visiting our website and opening the chat.</p>
                        <p style="margin-top: 15px;"><a href="${WEBSITE_URL}" style="color: #5865f2; font-weight: 600;">Visit our website → ${WEBSITE_URL}</a></p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">This is an automated notification. Please do not reply to this email.</p>
                    </div>
                `
            };
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ User notification email sent to ${userEmail}! ID: ${info.messageId}`);
            return;
        } catch (error) {
            console.log('⚠️  Node.js email failed:', error.message, '- trying Python...');
        }
    }

    try {
        await sendEmailViaPython('admin_reply', userName, userEmail, message);
    } catch (pythonError) {
        if (!EMAIL_USER || !EMAIL_PASSWORD) console.error('❌ Cannot send email: Set EMAIL_USER and EMAIL_PASSWORD in Render Environment.');
    }
}

// --- 3. DATABASE MODELS ---
const Chat = mongoose.model('Chat', new mongoose.Schema({
  socketId: String,
  name: { type: String, default: 'Guest' },
  email: { type: String, default: '' },
  messages: [{ sender: String, text: String, timestamp: { type: Date, default: Date.now } }],
  isAdminActive: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
}));

const Contact = mongoose.model('Contact', new mongoose.Schema({
  name: String, email: String, subject: String, message: String, date: { type: Date, default: Date.now }
}));

const Appointment = mongoose.model('Appointment', new mongoose.Schema({
  name: String, email: String, phone: String, type: String, date: String, slot: Object, createdAt: { type: Date, default: Date.now }
}));

// --- 4. SOCKET.IO LOGIC ---
// Track online status
const adminSockets = new Set(); // Track admin socket IDs
const userSockets = new Map(); // Track user socket IDs -> chat info

io.on('connection', (socket) => {
  
  // Track disconnections
  socket.on('disconnect', () => {
    adminSockets.delete(socket.id);
    userSockets.delete(socket.id);
    console.log(`Socket ${socket.id} disconnected`);
  });
  
  socket.on('admin_connected', async () => {
      adminSockets.add(socket.id);
      console.log(`✅ Admin connected (Total admins online: ${adminSockets.size})`);
      const chats = await Chat.find({}).sort({ lastUpdated: -1 });
      socket.emit('admin_update_userlist', chats);
  });

  // User Join
  socket.on('user_join', async (userData) => {
    try {
      const safeEmail = (userData && userData.email) ? userData.email.toLowerCase().trim() : '';
      let chat;
      let isNewChat = false;

      if (safeEmail) chat = await Chat.findOne({ email: safeEmail });
      if (!chat) chat = await Chat.findOne({ socketId: socket.id });

      if (chat) {
        // Existing chat - update socket ID
        chat.socketId = socket.id;
        chat.name = userData ? userData.name : chat.name;
        if (safeEmail) chat.email = safeEmail;
        chat.isAdminActive = false; 
        await chat.save();
        socket.emit('chat_history', chat.messages);
      } else {
        // New chat - create new record
        isNewChat = true;
        chat = new Chat({ 
          socketId: socket.id,
          name: userData ? userData.name : 'Guest',
          email: safeEmail,
          isAdminActive: false 
        }); 
        await chat.save(); 
      }

      // Track user as online (for both new and existing chats)
      userSockets.set(socket.id, { chatId: chat._id, email: safeEmail, name: userData ? userData.name : 'Guest' });

      // No email on join — admin gets ONE email only when user sends a message (see send_message)
      console.log(`📊 User joined chat: ${userData ? userData.name : 'Guest'}, Email: ${safeEmail || 'No email'}`);

      const allChats = await Chat.find({}).sort({ lastUpdated: -1 });
      io.emit('admin_update_userlist', allChats);
    } catch (e) { 
      console.error('❌ Error in user_join:', e); 
    }
  });

  // User Message
  socket.on('send_message', async (data) => {
    try {
        let chat = await Chat.findOne({ socketId: socket.id });
        if (!chat) {
          // Create chat if it doesn't exist
          chat = new Chat({ 
            socketId: socket.id,
            name: 'Guest',
            email: '',
            isAdminActive: false 
          });
          await chat.save();
        }

        chat.messages.push({ sender: 'user', text: data.message });
        chat.lastUpdated = Date.now();
        await chat.save();

        // Check if admin is online
        const isAdminOnline = adminSockets.size > 0;
        console.log(`💬 User sent message - Admin online: ${isAdminOnline}, Admin sockets: ${adminSockets.size}`);
        
        // Emit to admin (if online, they'll see it in real-time)
        io.emit('admin_receive_message', { socketId: socket.id, message: data.message, sender: 'user' });
        const allChats = await Chat.find({}).sort({ lastUpdated: -1 });
        io.emit('admin_update_userlist', allChats);

        // Send email to admin ONLY if admin is offline
        if (!isAdminOnline) {
          console.log('');
          console.log('═══════════════════════════════════════════════════');
          console.log('📧 ADMIN IS OFFLINE - Sending email notification');
          console.log('═══════════════════════════════════════════════════');
          await sendUserMessageEmailToAdmin(chat, data.message);
          console.log('═══════════════════════════════════════════════════');
          console.log('');
        } else {
          console.log('✅ Admin is online - No email sent (real-time chat)');
        }

        if (!chat.isAdminActive) {
            setTimeout(async () => {
                const botReply = getAutoReply(data.message);
                chat.messages.push({ sender: 'bot', text: botReply });
                await chat.save();
                socket.emit('receive_message', { text: botReply, sender: 'bot' });
                io.emit('admin_receive_message', { socketId: socket.id, message: botReply, sender: 'bot' });
            }, 1500);
        }
    } catch (e) { 
      console.error('❌ Error in send_message:', e); 
    }
  });

  // Admin Logic
  socket.on('admin_join_chat', async (id) => { 
    await Chat.findOneAndUpdate({ socketId: id }, { isAdminActive: true }); 
  });
  
  socket.on('admin_leave_chat', async (id) => { 
    await Chat.findOneAndUpdate({ socketId: id }, { isAdminActive: false }); 
  });
  
  socket.on('admin_send_message', async (data) => {
    const chat = await Chat.findOne({ socketId: data.targetSocketId });
    if (chat) {
      chat.messages.push({ sender: 'admin', text: data.message });
      await chat.save();
      
      // Check if user is online
      const isUserOnline = userSockets.has(data.targetSocketId);
      
      // Send message to user (if online, they'll see it in real-time)
      io.to(data.targetSocketId).emit('receive_message', { text: data.message, sender: 'admin' });
      
      // Send email to user ONLY if user is offline
      if (!isUserOnline) {
        console.log('📧 User is offline - Sending email notification');
        await sendAdminReplyEmailToUser(chat, data.message);
      } else {
        console.log('✅ User is online - No email sent (real-time chat)');
      }
    }
  });
});

function getAutoReply(msg) {
  msg = msg.toLowerCase();
  if (msg.includes('price') || msg.includes('cost')) return "Our pricing depends on scope. Shall we book a call?";
  if (msg.includes('hello') || msg.includes('hi')) return "Hi! Welcome to Ayurvia. How can I help?";
  return "Thanks! An agent will be with you shortly.";
}

// --- Health check (for Render/Vercel deployment) ---
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'degraded',
    mongodb: dbConnected ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// --- 5. ADMIN LOGIN ---
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASS || "Ayurvia2026"; 
    if (password === ADMIN_PASSWORD) { res.json({ success: true }); } 
    else { res.json({ success: false }); }
});

// --- 6. API ROUTES WITH EMAIL ALERTS ---

// Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    await new Contact(req.body).save();
    
    // 🔔 ALERT: New Contact Inquiry
    sendEmailAlert(
        "New Contact Inquiry", 
        `Name: ${req.body.name}\nEmail: ${req.body.email}\nSubject: ${req.body.subject}\nMessage: ${req.body.message}`
    );

    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Appointment Booking
app.post('/api/appointments', async (req, res) => {
  try {
    await new Appointment(req.body).save();

    // 🔔 ALERT: New Appointment (include email so admin sees it)
    sendEmailAlert(
        "New Appointment Booked! 📅", 
        `Name: ${req.body.name}\nEmail: ${req.body.email || 'Not provided'}\nPhone: ${req.body.phone}\nType: ${req.body.type}\nDate: ${req.body.date}\nTime: ${req.body.slot && req.body.slot.start ? req.body.slot.start : '-'}`
    );

    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/dashboard-data', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json({ contacts, appointments });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Test email endpoint (for debugging)
app.post('/api/test-email', async (req, res) => {
  try {
    console.log('🧪 Testing email configuration...');
    console.log('EMAIL_USER:', EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASSWORD:', EMAIL_PASSWORD ? 'Set' : 'Not set');
    
    if (!EMAIL_USER || !EMAIL_PASSWORD || EMAIL_USER === 'your_brevo_smtp_user') {
      return res.json({ 
        success: false, 
        message: 'Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file' 
      });
    }
    
    await sendEmailAlert(
      "Test Email", 
      "This is a test email to verify email configuration is working correctly."
    );
    
    res.json({ success: true, message: 'Test email sent! Check auryvia.infotech@gmail.com' });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on Port ${PORT}`);
  console.log(`📧 Email notifications: ${EMAIL_USER && EMAIL_PASSWORD && EMAIL_USER !== 'your_brevo_smtp_user' ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '⚠️  Connecting...'}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error('   Please close the other server or kill the process:');
    console.error(`   Windows: netstat -ano | findstr :${PORT}`);
    console.error(`   Then: taskkill /PID <PID> /F`);
    console.error(`   Or use a different port by setting PORT in .env file`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});
