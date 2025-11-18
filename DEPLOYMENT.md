# 🚀 Facebook Ads Dashboard - Vercel + Neon Deployment Guide

This guide will help you deploy your Facebook Ads Dashboard to Vercel using Neon as the PostgreSQL database.

## 📋 Prerequisites

- Vercel account (free tier is fine)
- Neon account (free tier with 3GB database)
- Node.js installed locally
- Git repository with your code

## 🗄️ Step 1: Set Up Neon Database

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create New Project**
   - Click "New Project"
   - Choose PostgreSQL
   - Select a region (closest to your users)
   - Give your project a name (e.g., `facebook-ads-dashboard`)

3. **Get Connection String**
   - Once created, go to Dashboard → Connection Details
   - Copy the "Connection string"
   - It should look like: `postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`

4. **Run Database Schema**
   - Go to the Neon SQL Editor
   - Copy and paste the contents of [`neon/schema.sql`](./neon/schema.sql)
   - Execute the SQL script to create all tables

## 🔧 Step 2: Configure Environment Variables

### For Local Development:
Create `.env` file with:
```env
DATABASE_URL="your-neon-connection-string"
JWT_SECRET="your-secure-jwt-secret"
APP_ENV="simulation"
```

### For Vercel Production:
In your Vercel project settings → Environment Variables, add:
```
DATABASE_URL=your-neon-connection-string
JWT_SECRET=your-secure-jwt-secret
APP_ENV=production
FACEBOOK_ACCESS_TOKEN=your-facebook-token (optional)
FACEBOOK_BUSINESS_ID=your-facebook-business-id (optional)
```

## 📦 Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Project**
   ```bash
   vercel --prod
   ```

### Option B: Using Git Integration

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Configure for Neon deployment"
   git push origin main
   ```

2. **Connect Repository to Vercel**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js

## ⚙️ Step 4: Vercel Configuration

The `vercel.json` file is already configured with:

- **Build Command**: `prisma generate && next build`
- **Cron Job**: Automatic sync every 5 minutes (`/api/sync`)
- **Function Timeout**: 30 seconds for API routes

## 🔄 Step 5: Database Migrations

For future schema changes:

1. **Update Prisma Schema**
   ```bash
   # Edit prisma/schema.prisma
   ```

2. **Generate Migration**
   ```bash
   npx prisma db push
   ```

3. **Deploy Changes**
   ```bash
   vercel --prod
   ```

## 🎯 Production Features

Once deployed, your dashboard will have:

### ✅ Automatic Data Sync
- Vercel cron job hits `/api/sync` every 5 minutes
- Fetches latest Facebook API data
- Updates database with new metrics

### ✅ Secure Authentication
- JWT-based session management
- HTTP-only secure cookies
- Protected routes with middleware

### ✅ Real-time Updates
- Dashboard auto-refreshes every 10 seconds
- Live campaign status changes
- Instant metric updates

### ✅ Production Database
- Neon PostgreSQL with automatic backups
- High availability and scalability
- SSL-encrypted connections

## 🔍 Step 6: Verify Deployment

1. **Check Database Connection**
   - Visit your deployed site
   - Try logging in with demo credentials
   - Verify data loads correctly

2. **Test Sync Functionality**
   - Click "Sync Data" button
   - Check if new data appears
   - Verify cron job is working (check Vercel logs)

3. **Test Campaign Management**
   - Click on an account card
   - Try pausing/activating campaigns
   - Check audit trail functionality

## 📊 Monitoring & Maintenance

### Vercel Logs
- Go to Vercel Dashboard → your project → Logs
- Monitor API errors and performance
- Check cron job execution

### Neon Dashboard
- Monitor database performance
- Check storage usage (3GB free limit)
- View query statistics

### Performance Optimization
- Monitor Vercel Function execution time
- Optimize database queries if needed
- Consider Vercel Pro for higher limits

## 🚨 Troubleshooting

### Common Issues:

**Database Connection Error**
```
Error: Can't reach database server
```
- Verify DATABASE_URL is correct
- Check SSL mode is enabled
- Ensure Neon database is active

**Build Error**
```
Error: Prisma Client generation failed
```
- Run `npx prisma generate` locally
- Check Prisma schema syntax
- Verify Node.js version compatibility

**Cron Job Not Working**
- Check Vercel cron configuration
- Verify `/api/sync` endpoint works
- Check Vercel function logs

**Facebook API Errors**
- Verify access token is valid
- Check Business Manager permissions
- Ensure APP_ENV="production"

## 🎉 Success!

Your Facebook Ads Dashboard is now running on Vercel with Neon database! 

### Next Steps:
1. Set up custom domain (optional)
2. Configure Facebook API for real data
3. Set up monitoring alerts
4. Add team members to Vercel project

### Support:
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Facebook Marketing API](https://developers.facebook.com/docs/marketing-api)

---

**🚀 Your production-ready Facebook Ads Dashboard is live!**