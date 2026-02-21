# Vercel Deployment Guide

## Simple 3-Step Deployment

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Shift Cipher Brute Force Analyzer"
git remote add origin https://github.com/bosco250/bruteforce-cryptanalysis.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Select `bruteforce-cryptanalysis` repository
5. Click "Deploy"

### Step 3: Done! 🎉

Your app will be live at: `https://bruteforce-cryptanalysis.vercel.app`

## What's Included

✅ Frontend (React + Vite)
✅ Backend API (Express serverless)
✅ Automatic routing
✅ No environment variables needed
✅ Everything hardcoded and ready

## How It Works

- **Frontend**: Deployed as static site
- **Backend**: Deployed as serverless functions
- **Routing**: 
  - `/api/*` → Backend
  - Everything else → Frontend

## Local Testing

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit: http://localhost:5173

## Troubleshooting

**Build fails?**
- Check that all dependencies are installed
- Ensure `vercel.json` exists in root

**API not working?**
- Verify routes start with `/api/`
- Check Vercel deployment logs

**Need help?**
- Check Vercel logs in dashboard
- Open GitHub issue

---

**That's it! No configuration, no environment variables, just deploy!** 🚀
