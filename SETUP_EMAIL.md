# Email Setup Guide - Auryvia Chat System

## ✅ System Overview

The email system now supports **both Python and Node.js** methods:
- **Primary**: Python script (more reliable with Gmail)
- **Fallback**: Node.js nodemailer (if Python fails)

## 🚀 Quick Setup (Gmail - Recommended)

### Step 1: Install Python 3

**Windows:**
1. Download Python from: https://www.python.org/downloads/
2. During installation, check "Add Python to PATH"
3. Verify installation:
   ```bash
   python --version
   ```

**Linux/Mac:**
```bash
# Usually pre-installed, but if not:
sudo apt-get install python3  # Ubuntu/Debian
brew install python3          # Mac
```

### Step 2: Install Python Dependencies

```bash
pip install python-dotenv
```

Or:
```bash
pip install -r requirements.txt
```

### Step 3: Create Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Go to: https://myaccount.google.com/apppasswords
4. Create App Password:
   - App: Select "Mail"
   - Device: Select "Other (Custom name)"
   - Name: Enter "Auryvia Chat"
   - Click "Generate"
5. **Copy the 16-character password** (remove spaces when using)

### Step 4: Update .env File

Edit your `.env` file in the project root:

```env
# Gmail Configuration
EMAIL_USER=auryvia.infotech@gmail.com
EMAIL_PASSWORD=your_16_char_app_password_here
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# MongoDB (keep existing)
MONGO_URI=mongodb://localhost:27017/auryvia

# Admin Password (keep existing)
ADMIN_PASS=Ayurvia2026

# Server Port (keep existing)
PORT=3000
```

**Important Notes:**
- Use your **Gmail address** (the one you want to send FROM)
- Use the **App Password** (not your regular password)
- Remove spaces from App Password: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

### Step 5: Test the Setup

1. **Test Python script directly:**
   ```bash
   python send_email.py alert "Test Email" "This is a test message"
   ```
   
   You should see: `SUCCESS: Email sent to auryvia.infotech@gmail.com`

2. **Start your server:**
   ```bash
   npm start
   ```
   
   Check console for:
   - `✅ Email server is ready to send messages` (if credentials are set)
   - `⚠️ WARNING: Email credentials not configured` (if not set)

3. **Test via API:**
   ```bash
   curl -X POST http://localhost:3000/api/test-email
   ```

## 📧 How Emails Work

### When Admin Receives Emails:

1. **User starts new chat** (admin offline):
   - Email to: `auryvia.infotech@gmail.com`
   - Subject: "New Chat Started!"
   - Contains: User name, email, notification

2. **User sends message** (admin offline):
   - Email to: `auryvia.infotech@gmail.com`
   - Subject: "💬 New Message from [User Name]"
   - Contains: User details and message content

### When User Receives Emails:

1. **Admin replies** (user offline):
   - Email to: User's email address
   - Subject: "Re: Your Message - Auryvia Support"
   - Contains: Admin's reply message

## 🔧 Troubleshooting

### Issue: "Python was not found"

**Solution:**
1. Install Python 3 from https://www.python.org/downloads/
2. Make sure to check "Add Python to PATH" during installation
3. Restart your terminal/command prompt
4. Verify: `python --version`

### Issue: "ModuleNotFoundError: No module named 'dotenv'"

**Solution:**
```bash
pip install python-dotenv
```

### Issue: "Email credentials not configured"

**Solution:**
1. Check your `.env` file exists in project root
2. Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set
3. Make sure there are no extra spaces or quotes
4. Restart the server after updating `.env`

### Issue: "Authentication failed" or "Invalid credentials"

**Solution:**
1. Make sure you're using **App Password**, not regular password
2. Verify 2-Step Verification is enabled on Gmail
3. Check App Password has no spaces
4. Try generating a new App Password

### Issue: Emails not sending

**Check:**
1. Server console logs for error messages
2. Python script works: `python send_email.py alert "Test" "Message"`
3. `.env` file has correct credentials
4. Gmail account allows "Less secure app access" (if using regular password)

### Issue: "Permission denied" (Linux/Mac)

**Solution:**
```bash
chmod +x send_email.py
```

## 🔄 Fallback to Node.js

If Python is not available, the system automatically falls back to Node.js email sending. However, Gmail with regular passwords may not work - you'll need:
- Gmail App Password (recommended)
- Or use Brevo/Sendinblue SMTP

## 📝 Alternative: Brevo/Sendinblue Setup

If you prefer Brevo instead of Gmail:

1. Sign up: https://www.brevo.com
2. Get SMTP credentials from: Settings → SMTP & API
3. Update `.env`:
   ```env
   EMAIL_USER=your_brevo_smtp_login
   EMAIL_PASSWORD=your_brevo_smtp_key
   SMTP_SERVER=smtp-relay.brevo.com
   SMTP_PORT=587
   ```

## ✅ Verification Checklist

- [ ] Python 3 installed and working
- [ ] `python-dotenv` installed
- [ ] Gmail App Password created
- [ ] `.env` file updated with credentials
- [ ] Python script test passes
- [ ] Server starts without email errors
- [ ] Test email API works
- [ ] User chat triggers email (when admin offline)

## 🆘 Still Having Issues?

1. Check server console logs for detailed error messages
2. Test Python script directly: `python send_email.py alert "Test" "Message"`
3. Verify `.env` file is in project root (same folder as `server.js`)
4. Make sure no firewall is blocking SMTP port 587

