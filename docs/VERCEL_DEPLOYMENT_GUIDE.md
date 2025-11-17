# Vercel Deployment Guide

Complete guide to deploy Retirement Ready Vault to Vercel with custom domain.

---

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Vercel account created ✅
- [ ] Vercel team "ai-focus" created ✅
- [ ] GitHub repo: https://github.com/tektekgo/Retirement-Ready-Vault.git ✅
- [ ] Domain: www.ai-focus.org on Cloudflare ✅
- [ ] Supabase project created (if using auth)
- [ ] Supabase credentials ready

---

## Step 1: Connect GitHub Repository to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Make sure you're in the "ai-focus" team

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - If repo not listed, click **"Configure GitHub App"** and grant access
   - Find and select: `tektekgo/Retirement-Ready-Vault`

3. **Configure Project**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build` (should auto-detect)
   - **Output Directory:** `dist` (should auto-detect)
   - **Install Command:** `npm install` (should auto-detect)

4. **Click "Deploy"** (we'll add environment variables next)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your team
vercel link --scope ai-focus

# Deploy
vercel --prod
```

---

## Step 2: Configure Environment Variables

After initial deployment, configure environment variables:

1. **Go to Project Settings**
   - In Vercel dashboard, click on your project
   - Go to **Settings** → **Environment Variables**

2. **Add Required Variables**

   **Supabase Configuration:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://your-project.supabase.co
   Environments: Production, Preview, Development
   ```

   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: your-anon-key-here
   Environments: Production, Preview, Development
   ```

   **Invite Code (Optional but Recommended):**
   ```
   Name: VITE_INVITE_CODES
   Value: YOURCODE123
   Environments: Production, Preview, Development
   ```

   **App URL (for email redirects):**
   ```
   Name: VITE_APP_URL
   Value: https://retirement-ready-vault.ai-focus.org
   Environments: Production
   ```

3. **Save and Redeploy**
   - Click **"Save"**
   - Go to **Deployments** tab
   - Click **"Redeploy"** on latest deployment (or it will auto-redeploy)

---

## Step 3: Configure Custom Domain

### In Vercel:

1. **Go to Project Settings**
   - Click on your project
   - Go to **Settings** → **Domains**

2. **Add Domain**
   - Enter: `retirement-ready-vault.ai-focus.org`
   - Click **"Add"**

3. **Get DNS Configuration**
   - Vercel will show DNS instructions
   - You'll see something like:
     ```
     Type: CNAME
     Name: retirement-ready-vault
     Value: cname.vercel-dns.com
     ```

### In Cloudflare:

**Option 1: CNAME Record (Recommended - Direct Connection)**

1. **Go to Cloudflare Dashboard**
   - Login to Cloudflare
   - Select domain: `ai-focus.org`

2. **Add CNAME Record**
   - Go to **DNS** → **Records**
   - Click **"Add record"**
   - **Type:** CNAME
   - **Name:** `retirement-ready-vault`
   - **Target:** `cname.vercel-dns.com` (or what Vercel shows)
   - **Proxy status:** Proxied (orange cloud) ✅
   - Click **"Save"**

3. **Wait for Propagation**
   - DNS changes take 5-60 minutes
   - Vercel will automatically detect and configure SSL

**Option 2: Redirect Rule (If you prefer redirect)**

If you want Cloudflare to handle the redirect instead:

1. **In Cloudflare:**
   - Go to **Rules** → **Redirect Rules**
   - Create rule:
     - **Name:** Retirement Vault Redirect
     - **If:** `retirement-ready-vault.ai-focus.org`
     - **Then:** Redirect to `https://your-vercel-url.vercel.app`
     - **Status Code:** 301 (Permanent)

2. **In Vercel:**
   - Still add the domain as above
   - Vercel will handle the actual app

**Note:** Option 1 (CNAME) is better for performance and SSL.

---

## Step 4: Verify Deployment

1. **Check Vercel Deployment**
   - Go to **Deployments** tab
   - Wait for build to complete (should show "Ready")
   - Click deployment to see build logs

2. **Test Domain**
   - Visit: `https://retirement-ready-vault.ai-focus.org`
   - Should load your app
   - SSL certificate should auto-configure (may take a few minutes)

3. **Test Registration**
   - Try registering with invite code
   - Verify environment variables are working

---

## Step 5: Update Supabase Redirect URLs

If using Supabase auth, update allowed redirect URLs:

1. **Go to Supabase Dashboard**
   - Project → **Authentication** → **URL Configuration**

2. **Add Site URL:**
   ```
   https://retirement-ready-vault.ai-focus.org
   ```

3. **Add Redirect URLs:**
   ```
   https://retirement-ready-vault.ai-focus.org/auth/callback
   https://retirement-ready-vault.ai-focus.org/auth/reset-password
   ```

---

## Troubleshooting

### Build Fails

**Check:**
- Build logs in Vercel dashboard
- Environment variables are set correctly
- Node version (Vercel auto-detects, but you can set in `package.json`)

**Add to `package.json` if needed:**
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Domain Not Working

**Check:**
- DNS records in Cloudflare (should show CNAME)
- DNS propagation (use `dig retirement-ready-vault.ai-focus.org`)
- Vercel domain settings (should show "Valid Configuration")
- SSL certificate (may take 5-10 minutes)

### Environment Variables Not Working

**Check:**
- Variables are set for correct environment (Production/Preview/Development)
- Variable names start with `VITE_` (required for Vite)
- Redeploy after adding variables

### Invite Code Not Working

**Check:**
- `VITE_INVITE_CODES` is set in Vercel
- Code matches exactly (case-insensitive)
- Redeploy after changing codes

---

## Quick Reference

### Vercel Project Settings
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x (auto)

### Environment Variables Needed
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_INVITE_CODES=YOURCODE123
VITE_APP_URL=https://retirement-ready-vault.ai-focus.org
```

### DNS Configuration (Cloudflare)
```
Type: CNAME
Name: retirement-ready-vault
Target: cname.vercel-dns.com (or Vercel-provided value)
Proxy: Enabled (orange cloud)
```

---

## Next Steps After Deployment

1. ✅ Test registration with invite code
2. ✅ Test login/logout
3. ✅ Test wizard completion
4. ✅ Test dashboard
5. ✅ Test export features
6. ✅ Monitor Supabase for new signups
7. ✅ Share invite code with trusted users

---

## Questions to Answer Before Deployment

Please provide:

1. **Supabase Credentials:**
   - Do you have Supabase project URL?
   - Do you have Supabase anon key?

2. **Invite Code:**
   - What invite code do you want to use initially?
   - Example: `RRV2025`, `AIFOCUS2025`, etc.

3. **Domain Preference:**
   - Do you want CNAME (direct) or Redirect (via Cloudflare)?
   - CNAME is recommended for better performance

4. **Environment:**
   - Do you want different codes for Production vs Preview?
   - Or same code for all environments?

Once you provide these, I can help you complete the deployment!

