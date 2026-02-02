# Deployment Guide (Render / Vercel)

## Recommended: Deploy on Render

This app uses **Socket.io** (persistent WebSocket connections) and a long-running Node server. **Render** is the right choice. **Vercel** is serverless and does not support Socket.io the same way; use Render for this project.

---

## Render: MongoDB not connecting

If the app deploys but **MongoDB does not connect** (chats/appointments/contacts not saving, or logs show `MongoDB Connection Error`), do the following.

### 1. Set `MONGO_URI` in Render

- Render Dashboard → your **Web Service** → **Environment**
- Add: **MONGO_URI** = your full connection string

**MongoDB Atlas example:**
```text
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/auryvia?retryWrites=true&w=majority
```

- Replace `USER`, `PASSWORD`, and cluster host with your Atlas values.
- Use the **Database** user password (not your Atlas login password).
- Create the user in Atlas: **Database Access** → Add Database User.

### 2. Allow access from anywhere (Atlas)

Render’s IP changes, so Atlas must allow all IPs:

- MongoDB Atlas → **Network Access** → **Add IP Address**
- Choose **“Allow Access from Anywhere”** (adds `0.0.0.0/0`)
- Save

Without this, Atlas blocks Render and you get connection timeouts.

### 3. Connection string format

- Use **Node.js driver 4.0+** (or 5.0) in the Atlas “Connect” dialog.
- Include `?retryWrites=true&w=majority` (or similar) at the end.
- No spaces or line breaks in the value in Render.

### 4. What the app does automatically

- **Retries**: Up to 4 connection attempts with a short delay (helps on cold start).
- **Longer timeout**: 20 seconds in deployment (helps with Atlas/DNS).
- **Health check**: `GET /api/health` returns 200 when MongoDB is connected; Render uses this to know when the service is ready.

After setting `MONGO_URI` and `0.0.0.0/0` in Atlas, redeploy. Check **Logs** in Render for `✅ Connected to MongoDB successfully`.

---

## Environment variables (Render)

| Variable         | Required | Description |
|------------------|----------|-------------|
| `MONGO_URI`      | **Yes**  | MongoDB connection string (e.g. Atlas `mongodb+srv://...`) |
| `EMAIL_USER`     | No       | Gmail for notifications |
| `EMAIL_PASSWORD` | No       | Gmail app password |
| `ADMIN_PASS`     | No       | Admin panel password (default in code) |

`PORT` is set by Render; do not add it.

---

## Vercel

This project is **not suitable for Vercel** as-is because:

- It runs a single long-lived Node server and **Socket.io**.
- Vercel is serverless (short-lived, per-request); WebSockets and Socket.io do not work the same way.

Use **Render** (or another platform that supports long-running Node + WebSockets) for this app.
