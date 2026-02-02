# Email Setup Instructions

## Quick Setup for Gmail (Recommended)

The system now uses Python to send emails, which works better with Gmail.

### Step 1: Install Python Dependencies

```bash
pip install python-dotenv
```

Or install from requirements.txt:
```bash
pip install -r requirements.txt
```

### Step 2: Configure Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Enable 2-Step Verification (if not already enabled)
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Create a new App Password:
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "Auryvia Chat" as the name
   - Click "Generate"
5. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Edit your `.env` file and set:

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

**Important:** 
- Use your Gmail address (e.g., `auryvia.infotech@gmail.com`)
- Use the App Password (not your regular Gmail password)
- Remove spaces from the App Password when pasting

### Step 4: Test Email

Restart your server and check the console. You should see:
```
✅ Email server is ready to send messages
```

Or test manually:
```bash
python send_email.py alert "Test" "This is a test email"
```

## How It Works

1. **When user starts chatting** (admin offline):
   - Email sent to: `auryvia.infotech@gmail.com`
   - Subject: "New Chat Started!"

2. **When user sends message** (admin offline):
   - Email sent to: `auryvia.infotech@gmail.com`
   - Subject: "💬 New Message from [User Name]"

3. **When admin replies** (user offline):
   - Email sent to: User's email address
   - Subject: "Re: Your Message - Auryvia Support"

## Troubleshooting

### Python not found
- Make sure Python 3 is installed: `python --version`
- On Windows, you might need to use `python3` instead of `python`

### Email not sending
1. Check `.env` file has correct credentials
2. Verify Gmail App Password is correct
3. Check server console for error messages
4. Test Python script directly:
   ```bash
   python send_email.py user_message "Test User" "test@example.com" "Hello"
   ```

### Permission denied
- Make sure `send_email.py` is executable (Linux/Mac):
  ```bash
  chmod +x send_email.py
  ```

## Alternative: Brevo/Sendinblue

If you prefer to use Brevo instead of Gmail:

1. Sign up at https://www.brevo.com
2. Get SMTP credentials from Settings → SMTP & API
3. Update `.env`:
   ```env
   EMAIL_USER=your_brevo_smtp_login
   EMAIL_PASSWORD=your_brevo_smtp_key
   SMTP_SERVER=smtp-relay.brevo.com
   SMTP_PORT=587
   ```

The system will automatically use the SMTP settings from your `.env` file.

