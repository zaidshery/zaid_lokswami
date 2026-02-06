# Lokswami Deployment Guide

This guide will walk you through deploying the Lokswami Hindi News Platform to production.

## 📋 Prerequisites

Before you begin, make sure you have:

1. **GitHub Account** - For code repository
2. **MongoDB Atlas Account** - For database (free tier available)
3. **Google Gemini API Key** - For AI features (free tier: 1500 req/day)
4. **Cloudinary Account** - For media storage (free tier: 25GB)
5. **Render Account** - For backend hosting (free tier available)
6. **Vercel Account** - For frontend hosting (free tier available)

## 🗄️ Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (M0 Sandbox - Free Tier)
3. Choose **Mumbai (ap-south-1)** region for low latency
4. Create a database user with read/write permissions
5. Add your IP to the Network Access whitelist (or use `0.0.0.0/0` for all IPs)
6. Get your connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lokswami?retryWrites=true&w=majority
   ```

## 🤖 Step 2: Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for later use
4. Note: Free tier allows 1500 requests per day

## ☁️ Step 3: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. From the Dashboard, note down:
   - Cloud Name
   - API Key
   - API Secret
4. Go to Settings > Upload
5. Create an upload preset named `lokswami_unsigned` (unsigned)

## 🚀 Step 4: Backend Deployment (Render)

### 4.1 Prepare Backend

1. Push your code to GitHub
2. Go to [Render](https://render.com/)
3. Click "New" > "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `lokswami-api`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

### 4.2 Add Environment Variables

Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=<your-mongodb-uri>
DB_NAME=lokswami_prod
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-1.5-flash-latest
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
JWT_ACCESS_SECRET=<generate-random-string>
JWT_REFRESH_SECRET=<generate-random-string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=<your-frontend-url>
```

Generate random secrets:
```bash
openssl rand -base64 32
```

### 4.3 Deploy

Click "Create Web Service". Render will automatically deploy your backend.

**Note**: Free tier spins down after 15 minutes of inactivity. First request may take ~30 seconds.

## 🎨 Step 5: Frontend Deployment (Vercel)

### 5.1 Prepare Frontend

1. Go to [Vercel](https://vercel.com/)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 5.2 Add Environment Variables

```
VITE_API_URL=https://your-render-url.onrender.com/api
```

### 5.3 Deploy

Click "Deploy". Vercel will build and deploy your frontend.

## 🔧 Step 6: Admin Deployment (Vercel)

### 6.1 Prepare Admin

1. In Vercel, add another project
2. Import the same repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 6.2 Add Environment Variables

```
VITE_API_URL=https://your-render-url.onrender.com/api
```

### 6.3 Deploy

Click "Deploy".

## 🌐 Step 7: Custom Domain (Optional)

### Vercel Custom Domain

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your domain (e.g., `lokswami.in`)
4. Follow DNS configuration instructions

### Render Custom Domain

1. Go to your Web Service settings in Render
2. Click "Custom Domains"
3. Add your API subdomain (e.g., `api.lokswami.in`)
4. Update frontend environment variable with new API URL

## 🧪 Step 8: Testing

### Test Backend
```bash
curl https://your-render-url.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "service": "lokswami-api"
}
```

### Test Frontend
- Visit your Vercel URL
- Check homepage loads
- Test navigation
- Test article pages

### Test Admin
- Visit admin Vercel URL
- Login with credentials
- Create a test article
- Test AI features

## 🔒 Security Checklist

- [ ] JWT secrets are strong and unique
- [ ] MongoDB IP whitelist is configured
- [ ] CORS is properly configured in backend
- [ ] Environment variables are not exposed in code
- [ ] HTTPS is enabled (Vercel/Render provide this)
- [ ] Rate limiting is enabled

## 📊 Monitoring

### Render Logs
- View logs in Render dashboard
- Set up log drains for production monitoring

### Vercel Analytics
- Enable Vercel Analytics for frontend metrics
- Monitor Core Web Vitals

## 🔄 CI/CD Setup

### Automatic Deployments

Both Render and Vercel support automatic deployments:

1. Connect your GitHub repository
2. Enable "Auto-Deploy" on push to main branch
3. Configure preview deployments for pull requests

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: cd backend && npm ci && npm run build
      - run: cd frontend && npm ci && npm run build
```

## 💰 Cost Estimation (Free Tier)

| Service | Free Tier Limits |
|---------|-----------------|
| MongoDB Atlas | 512MB storage, shared RAM |
| Render | 750 hours/month, spins down |
| Vercel | 100GB bandwidth, 6000 build minutes |
| Cloudinary | 25GB storage, 25GB bandwidth |
| Gemini API | 1500 requests/day |

**Total Cost: FREE** (for small to medium traffic)

## 🆘 Troubleshooting

### Backend Issues

**Issue**: 500 errors
- Check Render logs
- Verify environment variables
- Check MongoDB connection

**Issue**: CORS errors
- Update `FRONTEND_URL` in backend env
- Check CORS configuration

### Frontend Issues

**Issue**: API not connecting
- Verify `VITE_API_URL` is correct
- Check browser console for errors

**Issue**: Build fails
- Check for TypeScript errors
- Verify all dependencies are installed

### AI Issues

**Issue**: AI features not working
- Verify `GEMINI_API_KEY` is correct
- Check API quota (1500/day limit)
- Review backend logs

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Check documentation in `/docs` folder
- Review logs in Render/Vercel dashboards

---

**Happy Publishing!** 🎉