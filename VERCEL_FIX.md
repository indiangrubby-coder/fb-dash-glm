# 🚨 Vercel Deployment Fix - Step by Step

## ❌ Problem Identified:
Vercel error: `The pattern "api/sync/route.ts" defined in 'functions' doesn't match any Serverless Functions.`

## ✅ SOLUTION: Easy Fix!

### Step 1: Update Your Code on GitHub

1. **Open your project folder** on your computer
2. **Commit the fixed vercel.json file**:
   ```bash
   git add .
   git commit -m "Fix Vercel configuration"
   git push origin main
   ```

### Step 2: Redeploy on Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your project**: `fb-dash-glm`
3. **Click "Redeploy"** button
4. **Wait 2-3 minutes**

### Step 3: Add Environment Variables

1. **In Vercel project**, click **"Settings"** tab
2. **Click "Environment Variables"**
3. **Add these 3 variables**:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_NHevj6c4hOPF@ep-shy-band-ae2gr6ep-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - Environment: `Production`, `Preview`, `Development`
   - Click **Save**

   **Variable 2:**
   - Name: `JWT_SECRET`
   - Value: `my-super-secret-jwt-key-12345`
   - Environment: `Production`, `Preview`, `Development`
   - Click **Save**

   **Variable 3:**
   - Name: `APP_ENV`
   - Value: `simulation`
   - Environment: `Production`, `Preview`, `Development`
   - Click **Save**

### Step 4: Setup Neon Database

1. **Go to Neon Dashboard**: https://neon.tech
2. **Click on your project**
3. **Click "SQL Editor"** (left sidebar)
4. **Copy this entire SQL script**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_telegram TEXT,
    business_manager_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad accounts table
CREATE TABLE IF NOT EXISTS ad_accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    vendor_id TEXT REFERENCES vendors(id),
    business_manager_id TEXT,
    status TEXT,
    currency TEXT,
    timezone TEXT,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Account metrics table
CREATE TABLE IF NOT EXISTS account_metrics (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_account_id TEXT NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    spend DECIMAL(10,2),
    spend_cap DECIMAL(10,2),
    clicks INTEGER,
    impressions INTEGER,
    cpc DECIMAL(10,4),
    balance DECIMAL(10,2),
    status_at_fetch TEXT,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ad_account_id, date)
);

-- Account actions (audit log) table
CREATE TABLE IF NOT EXISTS account_actions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    performed_by TEXT NOT NULL,
    ad_account_id TEXT NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
    target_type TEXT,
    target_id TEXT,
    action TEXT NOT NULL,
    payload TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ad_accounts_vendor_id ON ad_accounts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_account_metrics_ad_account_id ON account_metrics(ad_account_id);
CREATE INDEX IF NOT EXISTS idx_account_metrics_date ON account_metrics(date);
CREATE INDEX IF NOT EXISTS idx_account_actions_ad_account_id ON account_actions(ad_account_id);
CREATE INDEX IF NOT EXISTS idx_account_actions_performed_by ON account_actions(performed_by);
```

5. **Paste it in Neon SQL Editor**
6. **Click "Run"** button

### Step 5: Test Your Live Site

1. **Visit your site**: https://fb-dash-km8kjw6o2-indiangrubbys-projects.vercel.app/
2. **Try to login**:
   - Username: `snafu`
   - Password: `random@123`
3. **Should work!** 🎉

## 🎯 What Should Happen:

✅ Vercel builds successfully  
✅ Environment variables are loaded  
✅ Database connects to Neon  
✅ Login page appears  
✅ Dashboard loads with sample data  

## 🔧 If Still Issues:

**Error: "Database connection failed"**
- Check DATABASE_URL is exactly correct
- Make sure no extra spaces
- Verify Neon database is active

**Error: "Build failed"**
- Check your git push went through
- Try redeploying again
- Check Vercel build logs

**Error: "Login not working"**
- Verify JWT_SECRET is set
- Check APP_ENV is "simulation"
- Clear browser cache

## 📞 Need Help?

If you get stuck at any step:
1. **Take a screenshot** of the error
2. **Tell me which step** you're on
3. **I'll help you fix it!**

## 🎉 Success!

Once working, your Facebook Ads Dashboard will be live at:
**https://fb-dash-km8kjw6o2-indiangrubbys-projects.vercel.app/**

You can then:
- Login with demo credentials
- View dashboard with sample data
- Switch to production mode with real Facebook API
- Have automatic sync every 5 minutes!