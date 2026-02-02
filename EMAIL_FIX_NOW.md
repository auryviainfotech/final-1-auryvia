# 🔧 Fix Email Authentication Error

## ❌ Current Problem
```
Invalid login: 535-5.7.8 Username and Password not accepted
```

## ✅ Solution

### The Issue
- `2025@auryvia` is **NOT a valid Gmail address**
- Gmail addresses must end with `@gmail.com`
- You need a **Gmail App Password** (not regular password)

### Step 1: Get Gmail App Password

1. **Go to:** https://myaccount.google.com/apppasswords
   - If link doesn't work, enable 2-Step Verification first: https://myaccount.google.com/security

2. **Create App Password:**
   - **App:** Select "Mail"
   - **Device:** Select "Other (Custom name)"
   - **Name:** Enter "Auryvia Chat"
   - Click **"Generate"**

3. **Copy the 16-character password**
   - It looks like: `abcd efgh ijkl mnop`
   - **Remove all spaces** when using it

### Step 2: Update .env File

Open `.env` file and make sure it has:

```env
EMAIL_USER=auryvia.infotech@gmail.com
EMAIL_PASSWORD=your_16_char_app_password_here
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

**Important:**
- ✅ Use `auryvia.infotech@gmail.com` (or your Gmail address)
- ✅ Use **App Password** (16 characters, no spaces)
- ✅ NO quotes around values
- ✅ NO spaces in password

### Step 3: Restart Server

```bash
npm start
```

You should see:
```
✅ Email server is ready to send messages
```

## 🧪 Test It

After restarting, have a user send a message in chat (with admin panel closed). You should see:
```
✅ Email sent successfully to auryvia.infotech@gmail.com!
```

## ❓ Still Not Working?

1. **Double-check App Password** - Make sure no spaces
2. **Verify 2-Step Verification** is enabled
3. **Try generating new App Password**
4. **Check .env file** - No extra quotes or spaces
5. **Restart server** after updating .env

## 📝 Quick Checklist

- [ ] Gmail account: `auryvia.infotech@gmail.com` (or your Gmail)
- [ ] 2-Step Verification enabled
- [ ] App Password created (16 characters)
- [ ] `.env` file updated with App Password (no spaces)
- [ ] Server restarted
- [ ] Console shows "Email server is ready"

