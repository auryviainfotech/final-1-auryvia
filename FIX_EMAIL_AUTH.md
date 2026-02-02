# Fix Email Authentication Error

## Current Error
```
❌ Email configuration error: Invalid login: 535 5.7.8 Authentication failed
```

This means your email credentials are set but **incorrect**.

## Solution: Use Gmail App Password

### Step 1: Enable 2-Step Verification on Gmail

1. Go to: https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click and enable it (if not already enabled)

### Step 2: Create Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
   - If you don't see this link, make sure 2-Step Verification is enabled first

2. Create App Password:
   - **App**: Select "Mail"
   - **Device**: Select "Other (Custom name)"
   - **Name**: Enter "Auryvia Chat"
   - Click **"Generate"**

3. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Open your `.env` file and update it:

```env
# Gmail Configuration
EMAIL_USER=auryvia.infotech@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

**Important:**
- ✅ Use your **Gmail address** (the one you want to send FROM)
- ✅ Use the **App Password** (NOT your regular Gmail password)
- ✅ **Remove spaces** from App Password: `abcd efgh ijkl mnop` → `abcdefghijklmnop`
- ✅ No quotes needed around values

### Step 4: Restart Server

```bash
npm start
```

You should now see:
```
✅ Email server is ready to send messages
```

## Common Mistakes

❌ **Using regular Gmail password** → Won't work, need App Password
❌ **Spaces in App Password** → Remove all spaces
❌ **2-Step Verification not enabled** → Must enable first
❌ **Wrong Gmail address** → Use the exact email you want to send from

## Alternative: Use Different Email Service

If Gmail doesn't work, you can use **Brevo (Sendinblue)**:

1. Sign up at: https://www.brevo.com
2. Get SMTP credentials from: Settings → SMTP & API
3. Update `.env`:
   ```env
   EMAIL_USER=your_brevo_smtp_login
   EMAIL_PASSWORD=your_brevo_smtp_key
   SMTP_SERVER=smtp-relay.brevo.com
   SMTP_PORT=587
   ```

## Test Email

After fixing credentials, test with:

```bash
curl -X POST http://localhost:3000/api/test-email
```

Or have a user send a message in chat (when admin is offline).

## Still Getting Error?

1. **Double-check App Password** - Make sure no spaces
2. **Verify 2-Step Verification** is enabled
3. **Try generating new App Password**
4. **Check .env file** - Make sure no extra quotes or spaces
5. **Restart server** after updating .env

