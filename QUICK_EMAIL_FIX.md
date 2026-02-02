# Quick Fix: Admin Email Notifications

## Problem
Admin is not receiving email notifications when users chat (when admin is offline).

## Solution: Configure Email Credentials

### Step 1: Update .env File

Open your `.env` file and add/update these lines:

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

### Step 2: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Create App Password:
   - Select "Mail"
   - Select "Other (Custom name)" → Enter "Auryvia"
   - Click "Generate"
3. Copy the 16-character password (remove spaces)

### Step 3: Update .env with Real Values

```env
EMAIL_USER=auryvia.infotech@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

**Important:** 
- Use your Gmail address (the one you want to send FROM)
- Use App Password (NOT your regular Gmail password)
- Remove spaces from App Password

### Step 4: Restart Server

```bash
npm start
```

### Step 5: Test

1. **Close admin panel** (so admin is marked as offline)
2. **Have a user send a message** in the chat
3. **Check console logs** - you should see:
   ```
   📧 ADMIN IS OFFLINE - Sending email notification
   ✅ Email sent successfully to auryvia.infotech@gmail.com!
   ```
4. **Check email inbox** at `auryvia.infotech@gmail.com`

## How It Works

- ✅ When admin panel is **CLOSED** → Admin is **OFFLINE**
- ✅ When user sends message → Email sent to `auryvia.infotech@gmail.com`
- ✅ When admin panel is **OPEN** → Admin is **ONLINE** → No email (real-time chat)

## Troubleshooting

### Check Console Logs

When a user sends a message, you should see:

```
📊 User sent message - Admin online: false, Admin sockets: 0
═══════════════════════════════════════════════════
📧 ADMIN IS OFFLINE - Sending email notification
═══════════════════════════════════════════════════
📧 Attempting to send email to admin: auryvia.infotech@gmail.com
```

### Common Errors

**Error: "Email credentials not configured"**
- ✅ Check `.env` file has `EMAIL_USER` and `EMAIL_PASSWORD`
- ✅ Make sure values don't have quotes
- ✅ Restart server after updating `.env`

**Error: "Authentication failed"**
- ✅ Make sure you're using **App Password**, not regular password
- ✅ Verify 2-Step Verification is enabled on Gmail
- ✅ Try generating a new App Password

**Error: "Python not found"**
- ✅ This is OK - system will use Node.js method instead
- ✅ Just make sure `.env` has correct credentials

## Test Email Endpoint

Test if email is working:

```bash
curl -X POST http://localhost:3000/api/test-email
```

Or visit in browser:
```
http://localhost:3000/api/test-email
```

## Verification Checklist

- [ ] `.env` file has `EMAIL_USER` set to Gmail address
- [ ] `.env` file has `EMAIL_PASSWORD` set to App Password
- [ ] Server restarted after updating `.env`
- [ ] Console shows "Email server is ready" (or no error)
- [ ] Admin panel is closed when testing
- [ ] User sends message in chat
- [ ] Console shows "Email sent successfully"
- [ ] Email received at `auryvia.infotech@gmail.com`

## Still Not Working?

1. **Check server console** for detailed error messages
2. **Verify admin is offline**: Console should show `Admin online: false`
3. **Test email directly**: `python send_email.py alert "Test" "Message"`
4. **Check spam folder** in Gmail
5. **Verify Gmail App Password** is correct

