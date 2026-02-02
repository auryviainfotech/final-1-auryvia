#!/usr/bin/env python3
"""
Email Sender for Auryvia Chat Notifications
Sends emails to admin when users chat (if admin is offline)
"""

import smtplib
import sys
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Email configuration
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
EMAIL_USER = os.getenv('EMAIL_USER', '')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')
ADMIN_EMAIL = 'auryvia.infotech@gmail.com'

def send_email(to_email, subject, html_content, text_content=None):
    """Send email using SMTP"""
    try:
        if not EMAIL_USER or not EMAIL_PASSWORD:
            print("ERROR: Email credentials not configured", file=sys.stderr)
            return False
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = f"Auryvia Chat <{EMAIL_USER}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add text and HTML parts
        if text_content:
            text_part = MIMEText(text_content, 'plain')
            msg.attach(text_part)
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
        
        print(f"SUCCESS: Email sent to {to_email}")
        return True
        
    except Exception as e:
        print(f"ERROR: {str(e)}", file=sys.stderr)
        return False

def send_user_message_to_admin(user_name, user_email, message):
    """Send notification to admin when user sends a message"""
    subject = f"💬 New Message from {user_name or 'Guest'}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #5865f2; color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f5f5f5; padding: 20px; border: 1px solid #ddd; }}
            .message-box {{ background: white; padding: 15px; border-left: 4px solid #5865f2; margin: 15px 0; }}
            .info {{ background: #e8f4f8; padding: 10px; border-radius: 5px; margin: 10px 0; }}
            .footer {{ color: #666; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h2 style="margin: 0;">New Chat Message</h2>
        </div>
        <div class="content">
            <div class="info">
                <p style="margin: 5px 0;"><strong>From:</strong> {user_name or 'Guest'}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> {user_email or 'No email provided'}</p>
            </div>
            <div class="message-box">
                <p style="margin: 0; font-size: 16px; line-height: 1.6;">{message}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Reply to this user through the admin panel when you're online.</p>
        </div>
        <div class="footer">
            <p>This is an automated notification from Auryvia Chat System.</p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
New Chat Message

From: {user_name or 'Guest'}
Email: {user_email or 'No email provided'}

Message:
{message}

Reply to this user through the admin panel when you're online.
    """
    
    return send_email(ADMIN_EMAIL, subject, html_content, text_content)

def send_admin_reply_to_user(user_name, user_email, message):
    """Send notification to user when admin replies"""
    if not user_email:
        print("ERROR: User email not provided", file=sys.stderr)
        return False
    
    subject = "Re: Your Message - Auryvia Support"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #5865f2; color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f5f5f5; padding: 20px; border: 1px solid #ddd; }}
            .message-box {{ background: white; padding: 15px; border-left: 4px solid #5865f2; margin: 15px 0; }}
            .footer {{ color: #999; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h2 style="margin: 0;">Reply from Auryvia Support</h2>
        </div>
        <div class="content">
            <p>Hi {user_name or 'there'},</p>
            <div class="message-box">
                <p style="margin: 0; font-size: 16px; line-height: 1.6;">{message}</p>
            </div>
            <p style="color: #666; font-size: 14px;">You can continue the conversation by visiting our website and opening the chat.</p>
        </div>
        <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
Reply from Auryvia Support

Hi {user_name or 'there'},

{message}

You can continue the conversation by visiting our website and opening the chat.

This is an automated notification. Please do not reply to this email.
    """
    
    return send_email(user_email, subject, html_content, text_content)

def send_general_alert(subject, message):
    """Send general alert email to admin"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }}
            .content {{ background: #f5f5f5; padding: 20px; border: 1px solid #ddd; }}
        </style>
    </head>
    <body>
        <div class="content">
            <h2>{subject}</h2>
            <p style="white-space: pre-line;">{message}</p>
        </div>
    </body>
    </html>
    """
    
    return send_email(ADMIN_EMAIL, f"🔔 {subject}", html_content, message)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python send_email.py <action> [args...]", file=sys.stderr)
        print("Actions:", file=sys.stderr)
        print("  user_message <user_name> <user_email> <message>", file=sys.stderr)
        print("  admin_reply <user_name> <user_email> <message>", file=sys.stderr)
        print("  alert <subject> <message>", file=sys.stderr)
        sys.exit(1)
    
    action = sys.argv[1]
    
    if action == "user_message":
        if len(sys.argv) < 5:
            print("ERROR: Missing arguments for user_message", file=sys.stderr)
            sys.exit(1)
        user_name = sys.argv[2]
        user_email = sys.argv[3]
        message = sys.argv[4]
        success = send_user_message_to_admin(user_name, user_email, message)
        sys.exit(0 if success else 1)
    
    elif action == "admin_reply":
        if len(sys.argv) < 5:
            print("ERROR: Missing arguments for admin_reply", file=sys.stderr)
            sys.exit(1)
        user_name = sys.argv[2]
        user_email = sys.argv[3]
        message = sys.argv[4]
        success = send_admin_reply_to_user(user_name, user_email, message)
        sys.exit(0 if success else 1)
    
    elif action == "alert":
        if len(sys.argv) < 4:
            print("ERROR: Missing arguments for alert", file=sys.stderr)
            sys.exit(1)
        subject = sys.argv[2]
        message = sys.argv[3]
        success = send_general_alert(subject, message)
        sys.exit(0 if success else 1)
    
    else:
        print(f"ERROR: Unknown action: {action}", file=sys.stderr)
        sys.exit(1)

