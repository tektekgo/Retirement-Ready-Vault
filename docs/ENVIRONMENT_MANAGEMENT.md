# Environment Variables Management Guide

## Local vs Production Environment Variables

### Best Practice: Keep Different Values

**Local Development (.env or .env.local):**
```env
VITE_APP_URL=http://localhost:5173
VITE_SUPABASE_URL=https://cqwuursyoonmbczzqtnl.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
VITE_INVITE_CODES=RRV2025
```

**Note:** Both `.env` and `.env.local` work for local development. Vite loads them in this order:
1. `.env.local` (highest priority, if exists)
2. `.env` (if `.env.local` doesn't exist)
3. Both are in `.gitignore` so they won't be committed ✅

**Vercel Production:**
```
VITE_APP_URL=https://retirement-ready-vault.ai-focus.org
VITE_SUPABASE_URL=https://cqwuursyoonmbczzqtnl.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
VITE_INVITE_CODES=RRV2025
```

**Why?**
- ✅ Local development uses `localhost:5173`
- ✅ Production uses your actual domain
- ✅ Vercel environment variables override local .env when deployed
- ✅ No need to change local file when deploying

---

## Your .env.local File

**Keep it as-is for local development:**
```env
VITE_APP_URL=http://localhost:5173
```

**Don't change it!** This is correct for local testing.

**Vercel will use its own environment variables** when building/deploying, so:
- Local: Uses `.env.local` → `http://localhost:5173` ✅
- Production: Uses Vercel env vars → `https://retirement-ready-vault.ai-focus.org` ✅

---

## Deployment Methods

### Option 1: Automatic GitHub Deployment (Recommended)

**How it works:**
- Vercel watches your GitHub repo
- Every push to `main` branch → Auto-deploys
- Every pull request → Creates preview deployment

**Setup:**
1. ✅ Already done when you imported repo to Vercel
2. Vercel connected to your GitHub repo
3. Auto-deploys on every push

**Workflow:**
```bash
# 1. Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# 2. Vercel automatically:
#    - Detects push
#    - Builds your app
#    - Deploys to production
#    - Uses Vercel environment variables
```

**Benefits:**
- ✅ Automatic deployments
- ✅ Preview deployments for PRs
- ✅ Build logs in Vercel dashboard
- ✅ Rollback capability

---

### Option 2: Manual Deployment via Vercel CLI

**When to use:**
- Testing before pushing to GitHub
- Deploying specific branch
- Quick deployments without git push

**Setup:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Link to your project:**
   ```bash
   # In your project directory
   vercel link
   ```
   - Select team: `ai-focus`
   - Select project: `Retirement-Ready-Vault`
   - Use existing settings: Yes

4. **Deploy:**
   ```bash
   # Preview deployment
   vercel
   
   # Production deployment
   vercel --prod
   ```

**Workflow:**
```bash
# Make changes locally
# Test locally with: npm run dev

# Deploy to preview
vercel

# If preview looks good, deploy to production
vercel --prod
```

**Note:** Still uses Vercel environment variables, not local .env

---

## Environment Variable Priority

When Vercel builds your app, it uses:

1. **Vercel Environment Variables** (highest priority)
   - Set in Vercel dashboard
   - Different for Production/Preview/Development
   - Used during build

2. **Local .env.local** (only for local dev)
   - Used when running `npm run dev` locally
   - Ignored by Vercel
   - Keep for local testing

**Example:**
```
Local .env.local:
VITE_APP_URL=http://localhost:5173

Vercel Production:
VITE_APP_URL=https://retirement-ready-vault.ai-focus.org

Result:
- Local dev: Uses localhost ✅
- Production: Uses retirement-ready-vault.ai-focus.org ✅
```

---

## Recommended Setup

### Local Development (.env or .env.local)
```env
# Keep these for local testing
VITE_APP_URL=http://localhost:5173
VITE_SUPABASE_URL=https://cqwuursyoonmbczzqtnl.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_INVITE_CODES=RRV2025
```

**Note:** You're using `.env` - that's perfectly fine! Both `.env` and `.env.local` work the same way for local development.

### Vercel Production Environment Variables
```
VITE_APP_URL=https://retirement-ready-vault.ai-focus.org
VITE_SUPABASE_URL=https://cqwuursyoonmbczzqtnl.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_INVITE_CODES=RRV2025
```

### Vercel Preview Environment Variables (Optional)
```
VITE_APP_URL=https://your-preview-url.vercel.app
VITE_SUPABASE_URL=https://cqwuursyoonmbczzqtnl.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_INVITE_CODES=RRV2025
```

---

## Deployment Workflow Summary

### Standard Workflow (Recommended)

```bash
# 1. Develop locally
npm run dev
# Uses .env.local → localhost:5173

# 2. Test locally
# Make sure everything works

# 3. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# 4. Vercel auto-deploys
# Uses Vercel env vars → retirement-ready-vault.ai-focus.org
# Check Vercel dashboard for deployment status
```

### Manual Deployment Workflow

```bash
# 1. Develop locally
npm run dev

# 2. Test locally

# 3. Deploy preview
vercel
# Creates preview URL

# 4. Test preview URL

# 5. Deploy to production
vercel --prod
# Uses Vercel env vars → retirement-ready-vault.ai-focus.org
```

---

## Quick Answers

**Q: Should I update VITE_APP_URL in .env.local?**
**A:** ❌ NO! Keep it as `http://localhost:5173` for local development.

**Q: How does Vercel know what URL to use?**
**A:** Vercel uses environment variables set in Vercel dashboard, not your local .env file.

**Q: How do I deploy?**
**A:** 
- **Automatic:** Just `git push` → Vercel auto-deploys ✅
- **Manual:** Use `vercel --prod` command

**Q: Do I need to change .env.local when deploying?**
**A:** ❌ NO! Vercel uses its own environment variables.

---

## Summary

✅ **Keep .env.local as-is:**
- `VITE_APP_URL=http://localhost:5173` ✅
- Used only for local development

✅ **Set Vercel environment variables:**
- `VITE_APP_URL=https://retirement-ready-vault.ai-focus.org` (Production)
- Used when Vercel builds/deploys

✅ **Deploy via GitHub:**
- Push to `main` → Auto-deploys
- No manual steps needed

✅ **Or deploy manually:**
- Use `vercel --prod` command
- Still uses Vercel env vars

**Bottom line:** Your local .env.local is perfect as-is! Vercel will use its own environment variables when deploying.

