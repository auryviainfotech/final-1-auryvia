# Deployment Guide (Render / Vercel)

## Recommended: Deploy on Render

This app uses **Socket.io** (persistent WebSocket connections) and a long-running Node server. **Render** is the right choice. **Vercel** is serverless and does not support Socket.io the same way; use Render for this project.

---

## Render: Step-by-step (full deploy)

### Step 1: Create a Render account and connect GitHub

1. Go to **[render.com](https://render.com)** and sign up (or sign in) with **GitHub**.
2. In the dashboard, click **“New +”** → **“Web Service”**.
3. Connect **GitHub** if you haven’t: **“Connect account”** and authorize Render.
4. Find the repo **auryviainfotech/final-1-auryvia** and click **“Connect”**.

### Step 2: Configure the Web Service

On the “Create Web Service” screen, set:

| Field | Value |
|--------|--------|
| **Name** | `final-1-auryvia` (or any name) |
| **Region** | Choose closest to you (e.g. Singapore, Oregon) |
| **Branch** | `main` |
| **Runtime** | **Node** |
| **Build Command** | `npm install` |
| **Start Command** | `npm run start` |
| **Instance Type** | **Free** (or paid if you prefer) |

Leave **Root Directory** empty unless the app is in a subfolder.

### Step 3: Add environment variables

1. Expand **“Advanced”** (or find **“Environment”** in the form).
2. Under **Environment Variables**, click **“Add Environment Variable”**.
3. Add:

| Key | Value |
|-----|--------|
| `MONGO_URI` | Your MongoDB Atlas connection string (see Step 4 below) |
| `EMAIL_USER` | Your Gmail (optional; for email alerts) |
| `EMAIL_PASSWORD` | Gmail app password (optional) |
| `ADMIN_PASS` | Admin panel password (optional; default in code if not set) |

Do **not** add `PORT`; Render sets it automatically.

### Step 4: Get your MongoDB connection string (if not done yet)

1. Go to **[MongoDB Atlas](https://cloud.mongodb.com)** → your project → **Clusters**.
2. Click **“Connect”** on your cluster → **“Drivers”** → copy the connection string.
3. Replace `<password>` with your **database user** password (Database Access → create/edit user).
4. Add the database name: change `...mongodb.net/` to `...mongodb.net/auryvia?retryWrites=true&w=majority`.
5. If the password has `#`, `@`, `%`, etc., **URL-encode** them (e.g. `#` → `%23`).
6. In **Atlas → Network Access**, add **“Allow Access from Anywhere”** (`0.0.0.0/0`) so Render can connect.

Paste the final string as the **MONGO_URI** value in Render.

### Step 5: Deploy

1. Click **“Create Web Service”**.
2. Render will clone the repo, run **Build Command** (`npm install`), then **Start Command** (`npm run start`).
3. Wait for the build and deploy to finish (check **Logs** in the left sidebar).
4. When the deploy is **Live**, your app URL will be like **`https://final-1-auryvia.onrender.com`**.

### Step 6: Verify

1. Open **Logs** (left sidebar) and look for **`✅ Connected to MongoDB successfully`**.
2. Open **`https://YOUR-SERVICE-NAME.onrender.com`** in a browser — the site should load.
3. Open **`https://YOUR-SERVICE-NAME.onrender.com/api/health`** — you should see `{"status":"ok","mongodb":"connected",...}`.
4. Test: chat, contact form, book appointment, admin at **`/admin/login.html`**.

### Step 7: Later deploys

- **Auto-deploy:** Push to the `main` branch on GitHub; Render will redeploy automatically (if enabled in service **Settings**).
- **Manual deploy:** Dashboard → your service → **“Manual Deploy”** → **“Deploy latest commit”**.

---

## Render: "Cannot find module 'express'" or wrong build

If the deploy fails with **Error: Cannot find module 'express'**, Render is building with **Python** instead of **Node**, so `npm install` never runs.

**Fix in Render Dashboard:**

1. Open your **Web Service** (e.g. final-1-auryvia) → **Settings**.
2. Under **Build & Deploy**:
   - **Runtime:** set to **Node** (not Python).
   - **Build Command:** set to **`npm install`** (not `pip install -r requirements.txt`).
   - **Start Command:** keep **`npm run start`** (or `node server.js`).
3. **Save Changes**, then trigger a **Manual Deploy** → **Deploy latest commit**.

The repo has both `package.json` (Node) and `requirements.txt` (Python for optional email script). The main app is Node; the build must run `npm install` so Express and other dependencies are installed.

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

## Email on Render: Step-by-step (mail function not working)

If the app is deployed but **emails (contact form, chat alerts, appointment alerts) are not sending**, follow these steps.

### Step 1: Turn on 2-Step Verification for your Gmail

1. Go to **[myaccount.google.com](https://myaccount.google.com)** and sign in with the Gmail you will use for **EMAIL_USER** (e.g. `auryvia.infotech@gmail.com`).
2. Click **Security** (left sidebar or top).
3. Under **“How you sign in to Google”**, click **2-Step Verification**.
4. If it is **Off**, turn it **On** and complete the setup (phone number, code). You must have 2-Step Verification on to create an App Password.

### Step 2: Create a Gmail App Password

1. Still in **[myaccount.google.com](https://myaccount.google.com)** → **Security**.
2. Under **“How you sign in to Google”**, click **App passwords** (if you don’t see it, search “App passwords” in the Google Account page or ensure 2-Step Verification is on).
3. At the bottom, click **“Select app”** → choose **Mail** (or **Other** and type **Auryvia**).
4. Click **“Select device”** → choose **Other** and type **Render**.
5. Click **Generate**.
6. Copy the **16-character password** (e.g. `abcd efgh ijkl mnop`). You can paste it with or without spaces; the app will use it as-is. Save it somewhere safe — you’ll use it in Step 4.

### Step 3: Open Render Environment

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and sign in.
2. Click your **Web Service** (e.g. **final-1-auryvia-1**).
3. In the left sidebar, under **MANAGE**, click **Environment**.

### Step 4: Add or edit EMAIL_USER and EMAIL_PASSWORD

1. Under **Environment Variables**, click **“Add Environment Variable”** (or **“+”**).
2. Add the first variable:
   - **Key:** `EMAIL_USER`
   - **Value:** your full Gmail address (e.g. `auryvia.infotech@gmail.com`)
   - Click **Save** or **Add**.
3. Add the second variable:
   - **Key:** `EMAIL_PASSWORD`
   - **Value:** paste the **16-character App Password** you copied in Step 2 (no spaces is fine, e.g. `abcdefghijklmnop`).
   - Click **Save** or **Add**.
4. Do **not** use your normal Gmail password; use only the App Password from Step 2.

### Step 5: Redeploy the service

1. In the left sidebar, click **Dashboard** (or stay on the service page).
2. Click **Manual Deploy** → **Deploy latest commit** (or **Clear build cache & deploy** if you want a clean build).
3. Wait for the deploy to finish (watch **Logs**).

### Step 6: Verify email is configured

1. In the left sidebar, click **Logs**.
2. After the new deploy, look for the startup line:
   - **`📧 Email notifications: ✅ Configured`** — email env vars are set; try sending a contact form or triggering a chat/appointment alert.
   - **`📧 Email notifications: ⚠️ Not configured`** — EMAIL_USER or EMAIL_PASSWORD is missing or wrong; double-check Step 4 and redeploy.
3. Test: submit the **contact form** on your live site or send a **chat message** (with admin offline) and check the inbox for **EMAIL_USER**. You should receive the notification email.

---

## Vercel: Step-by-step (with limitations)

You can deploy the **frontend** to Vercel so the site is fast and globally distributed. **Important:** This app uses **Socket.io** and a long-running Node server. On Vercel, **API routes and live chat will not work** unless you run the backend elsewhere (e.g. Render). The steps below give you a Vercel deploy; for full functionality (chat, forms, admin) use **Render** for the same repo.

### Step 1: Sign in and import the repo

1. Go to **[vercel.com](https://vercel.com)** and sign in (GitHub recommended).
2. Click **“Add New…”** → **“Project”**.
3. **Import** your repo: connect **GitHub** if needed, then find **auryviainfotech/final-1-auryvia** and click **Import**.

### Step 2: Configure the project

On the “Configure Project” screen:

| Field | Value |
|--------|--------|
| **Project Name** | `final-1-auryvia` (or any name) |
| **Framework Preset** | **Other** (or leave as detected) |
| **Root Directory** | Leave **empty** (`.` = repo root) |
| **Build Command** | Leave **empty** or set to `npm run build` only if you add a build script later |
| **Output Directory** | Leave **empty** (Vercel will serve static files from root) |
| **Install Command** | `npm install` (optional; often auto-detected) |

### Step 3: Environment variables

1. Expand **“Environment Variables”**.
2. Add (for any serverless API or future backend you might add):

| Name | Value | Notes |
|------|--------|--------|
| `MONGO_URI` | Your Atlas connection string | e.g. `mongodb+srv://user:pass@cluster....mongodb.net/auryvia?retryWrites=true&w=majority` |
| `EMAIL_USER` | Your Gmail | Optional |
| `EMAIL_PASSWORD` | Gmail app password | Optional |
| `ADMIN_PASS` | Admin password | Optional |

3. Select **Production** (and optionally Preview) for each variable.
4. Click **Add** for each, then continue.

### Step 4: Deploy

1. Click **“Deploy”**.
2. Wait for the build to finish. Vercel will build and deploy.
3. When done, you get a URL like **`https://final-1-auryvia.vercel.app`**.

### Step 5: What works / what doesn’t on Vercel

| Works on Vercel | Does not work on Vercel (use Render for these) |
|-----------------|-------------------------------------------------|
| Static pages (HTML, CSS, JS) | **Live chat** (Socket.io needs a long-running server) |
| Browsing the site | **Contact / appointment forms** (need your Node API) |
| | **Admin panel** (needs your Node API) |
| | **Real-time messages** |

**Recommendation:** Use **Render** for the **full app** (same repo: Node server + Socket.io + MongoDB). Use **Vercel** only if you want the same repo as a **static frontend** and run the API + chat on Render (or another host) and point the frontend to that API URL.
