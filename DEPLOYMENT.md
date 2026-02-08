# 🚀 Deployment Guide - Md Imran's Portfolio

Complete guide to deploy your Next.js frontend and Node.js backend to production.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Gmail App Password configured
- ✅ Domain name (optional but recommended)

---

## 🎨 Frontend Deployment (Vercel)

### Why Vercel?
- Best for Next.js (made by the same team)
- Free tier with excellent performance
- Automatic HTTPS
- Global CDN
- Zero configuration

### Steps:

1. **Push to GitHub** (Already done! ✅)

2. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub

3. **Import Project**
   - Click "Add New Project"
   - Select your `Portfolio` repository
   - Vercel will auto-detect Next.js

4. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

5. **Environment Variables** (Add these in Vercel Dashboard)
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.railway.app
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at: `your-portfolio.vercel.app`

7. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

---

## 🔧 Backend Deployment (Railway)

### Why Railway?
- Free $5 credit per month
- Easy deployment
- Auto-scaling
- Environment variables support
- Perfect for Node.js

### Steps:

1. **Sign up/Login to Railway**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `Portfolio` repository

3. **Configure Service**
   - Click on the service
   - Go to "Settings"
   - **Root Directory**: Set to `backend`
   - **Start Command**: `npm start`
   - **Build Command**: `npm install`

4. **Add Environment Variables**
   Go to "Variables" tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   
   # Your frontend URL (will get after Vercel deployment)
   FRONTEND_URL=https://your-portfolio.vercel.app
   
   # Gmail Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=dev.mdimran@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   
   # Where to receive emails
   RECIPIENT_EMAIL=dev.mdimran@gmail.com
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=5
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the generated URL: `your-backend.railway.app`

6. **Update Frontend**
   - Go back to Vercel
   - Update environment variable:
     ```
     NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
     ```
   - Redeploy frontend

7. **Test Backend**
   ```bash
   curl https://your-backend.railway.app/health
   ```

---

## 🔄 Alternative: Backend on Render

### Steps for Render:

1. **Sign up**: https://render.com

2. **New Web Service**
   - Connect GitHub
   - Select `Portfolio` repo

3. **Configure**
   ```
   Name: portfolio-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables** (same as Railway)

5. **Create Web Service** - Free tier available!

---

## 🔄 Alternative: VPS Deployment (DigitalOcean, AWS, Linode)

### Frontend (Next.js on VPS)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone https://github.com/mdimran29/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Build
npm run build

# Install PM2
sudo npm install -g pm2

# Start
pm2 start npm --name "portfolio-frontend" -- start
pm2 save
pm2 startup
```

### Backend (Node.js on same or different VPS)

```bash
cd Portfolio/backend
npm install
pm2 start server.js --name "portfolio-backend"
pm2 save
```

### Nginx Configuration

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## 🔐 Gmail App Password Setup

1. Go to Google Account: https://myaccount.google.com
2. Security → 2-Step Verification (enable it)
3. App Passwords: https://myaccount.google.com/apppasswords
4. Select "Mail" → "Other (Custom name)" → "Portfolio Backend"
5. Generate → Copy the 16-character password
6. Use this in your `EMAIL_PASSWORD` environment variable

---

## ✅ Post-Deployment Checklist

### Frontend Checks:
- [ ] Site loads correctly
- [ ] All 3D animations working
- [ ] Images loading (profile photo, etc.)
- [ ] Resume download working
- [ ] Contact form renders
- [ ] Navigation working
- [ ] Mobile responsive
- [ ] No console errors

### Backend Checks:
- [ ] Health endpoint: `curl https://your-backend.com/health`
- [ ] Contact form submission works
- [ ] Emails received (both notification and auto-reply)
- [ ] Rate limiting working (try 6 submissions)
- [ ] Error handling working

### Test Contact Form:
```bash
curl -X POST https://your-backend.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "Testing the contact form after deployment."
  }'
```

---

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

2. **Auto-Deploy**
   - Vercel: Automatically deploys on push to `main`
   - Railway: Automatically deploys on push to `main`

3. **Monitor**
   - Vercel Dashboard: Check deployment logs
   - Railway Dashboard: Check deployment logs

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)
- Go to your project → Analytics
- View page views, performance, etc.

### Railway Metrics (Built-in)
- Go to your service → Metrics
- View CPU, memory, network usage

### Google Analytics (Optional)
1. Create GA4 property: https://analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to your Next.js:
   ```tsx
   // In layout.tsx <head>
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

---

## 🐛 Troubleshooting

### Frontend Issues:

**Issue**: 3D animations not working
- **Solution**: Check browser console for WebGL errors
- Ensure Three.js loaded correctly

**Issue**: Images not loading
- **Solution**: Check public folder structure
- Verify file paths in code

### Backend Issues:

**Issue**: Emails not sending
- **Solution**: 
  - Verify Gmail App Password is correct
  - Check `EMAIL_USER` and `EMAIL_PASSWORD` in env vars
  - Test with: `curl https://your-backend.com/api/contact/test`

**Issue**: CORS errors
- **Solution**: Update `FRONTEND_URL` in backend env vars to match your actual frontend URL

**Issue**: Rate limiting too strict
- **Solution**: Adjust `RATE_LIMIT_MAX_REQUESTS` in env vars

### Common Errors:

```
Error: Invalid login
→ Use Gmail App Password, not regular password

Error: CORS blocked
→ Update FRONTEND_URL to match your Vercel URL

Error: Connection refused
→ Check if backend is running
→ Verify PORT in environment variables
```

---

## 📱 Mobile Testing

Test on multiple devices:
- iOS Safari
- Android Chrome
- Different screen sizes
- Touch interactions
- Performance

Use tools:
- Chrome DevTools (Device Mode)
- BrowserStack
- Real devices

---

## 🎯 Performance Optimization

### Frontend:
```bash
# Analyze bundle size
npm run build
# Check .next/analyze output
```

### Backend:
- Monitor Railway/Render metrics
- Check response times
- Optimize email sending (async)

---

## 📞 Support

If you encounter issues:

1. **Check Logs**
   - Vercel: Deployment logs in dashboard
   - Railway: Runtime logs in dashboard

2. **Test Locally**
   ```bash
   # Frontend
   npm run dev

   # Backend
   cd backend
   npm run dev
   ```

3. **Common Solutions**
   - Clear cache and redeploy
   - Verify environment variables
   - Check service status

---

## 🎉 You're Live!

Congratulations! Your portfolio is now live with:

✅ Beautiful Next.js frontend with Three.js animations
✅ Professional contact form with email notifications
✅ Auto-reply to users
✅ Rate limiting and security
✅ Continuous deployment from GitHub

Share your portfolio:
- LinkedIn: Update your profile with the link
- GitHub: Add to repository description
- Resume: Include the URL
- Email signature: Add the link

---

**Built with ❤️ by Md Imran**

Need help? Contact me:
- Email: dev.mdimran@gmail.com
- GitHub: @mdimran29
- LinkedIn: mdimran29
