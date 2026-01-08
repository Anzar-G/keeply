# Railway Deployment Guide

## Backend Deployment to Railway

### Step 1: Create Railway Account

1. Go to <https://railway.app>
2. Sign in with GitHub

### Step 2: Deploy Backend

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose repository: `Anzar-G/keeply`
4. Select **"backend"** folder as root directory

### Step 3: Configure Environment Variables

Add these variables in Railway dashboard:

```env
PORT=5000
JWT_SECRET=your_production_secret_key_here_change_this
JWT_EXPIRES_IN=7d
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Copy the generated URL (e.g., `https://keeply-backend.up.railway.app`)

---

## Frontend Deployment to Vercel

### Step 1: Update Environment Variable

Create `.env.production` in `contact-manager/`:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

Replace `your-backend-url.railway.app` with your actual Railway URL.

### Step 2: Commit Changes

```bash
git add .
git commit -m "Add production environment config"
git push origin master
```

### Step 3: Deploy to Vercel

1. Go to <https://vercel.com>
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import `Anzar-G/keeply`
5. **Root Directory:** Select `contact-manager`
6. **Environment Variables:** Add `REACT_APP_API_URL` with Railway URL
7. Click **"Deploy"**

### Step 4: Test

1. Open Vercel URL (e.g., `https://keeply.vercel.app`)
2. Should redirect to login page
3. Login with: `admin@example.com` / `admin123`
4. Test CRUD operations

---

## Troubleshooting

### CORS Error

If you get CORS error, update `backend/server.js`:

```javascript
app.use(cors({
    origin: ['https://keeply.vercel.app', 'http://localhost:3000'],
    credentials: true
}));
```

### 401 Unauthorized

- Check if JWT_SECRET is set in Railway
- Check if token is being sent in requests

### Database Empty

- Railway will auto-create tables on first run
- Default admin user will be created automatically

---

## URLs After Deployment

- **Frontend:** `https://keeply.vercel.app`
- **Backend API:** `https://keeply-backend.railway.app`
- **API Docs:** `https://keeply-backend.railway.app/api/contacts`
