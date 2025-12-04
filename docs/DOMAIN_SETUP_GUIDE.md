# Domain Setup Guide: retirement-ready-vault.ai-focus.org

Quick guide to configure your custom domain with Vercel and Cloudflare.

---

## Step 1: Add Domain in Vercel (START HERE)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: **Retirement-Ready-Vault**

2. **Navigate to Domain Settings**
   - Click **Settings** tab
   - Click **Domains** in the left sidebar

3. **Add Your Domain**
   - In the "Domains" section, enter: `retirement-ready-vault.ai-focus.org`
   - Click **"Add"** button

4. **Get DNS Configuration**
   - Vercel will show you DNS instructions
   - You'll see something like:
     ```
     Type: CNAME
     Name: retirement-ready-vault
     Target: cname.vercel-dns.com
     ```
   - **IMPORTANT:** Copy the exact Target value (it might be different)
   - Status will show "Pending" until DNS is configured

---

## Step 2: Configure DNS in Cloudflare

1. **Login to Cloudflare**
   - Go to: https://dash.cloudflare.com
   - Select domain: **ai-focus.org**

2. **Go to DNS Settings**
   - Click **DNS** in the left sidebar
   - Click **Records** tab

3. **Add CNAME Record**
   - Click **"Add record"** button
   - Configure:
     ```
     Type: CNAME
     Name: retirement-ready-vault
     Target: [Paste the Target value from Vercel - e.g., cname.vercel-dns.com]
     Proxy status: Proxied (orange cloud) ✅
     TTL: Auto
     ```
   - Click **"Save"**

4. **Verify Record Added**
   - You should see:
     ```
     retirement-ready-vault  CNAME  cname.vercel-dns.com  Proxied
     ```

---

## Step 3: Wait for DNS Propagation

1. **DNS Propagation Time**
   - Usually takes **5-60 minutes**
   - Can take up to 24 hours (rare)

2. **Check Status in Vercel**
   - Go back to Vercel → Settings → Domains
   - Status should change from **"Pending"** → **"Valid Configuration"**
   - SSL certificate will auto-generate (may take 5-10 minutes after DNS is valid)

3. **Test Your Domain**
   - Visit: `https://retirement-ready-vault.ai-focus.org`
   - Should load your app
   - Check browser shows secure padlock (SSL)

---

## Step 4: Update Environment Variables (If Needed)

If you haven't already, update `VITE_APP_URL` in Vercel:

1. **Go to Vercel** → Settings → Environment Variables
2. **Update or Add:**
   ```
   Name: VITE_APP_URL
   Value: https://retirement-ready-vault.ai-focus.org
   Environments: Production
   ```
3. **Redeploy** (or wait for next deployment)

---

## Step 5: Update Supabase Redirect URLs (If Using Auth)

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

### Domain Shows "Pending" in Vercel

**Check:**
- DNS record exists in Cloudflare
- CNAME Target matches exactly what Vercel shows
- Proxy is enabled (orange cloud) in Cloudflare
- Wait 5-60 minutes for DNS propagation

**Verify DNS:**
```bash
# Check DNS propagation
dig retirement-ready-vault.ai-focus.org

# Or use online tool
# https://dnschecker.org/#CNAME/retirement-ready-vault.ai-focus.org
```

### SSL Certificate Not Generated

**Check:**
- DNS is showing "Valid Configuration" in Vercel
- Wait 5-10 minutes after DNS is valid
- Try accessing `https://retirement-ready-vault.ai-focus.org` (forces SSL check)

### Domain Not Loading

**Check:**
- DNS propagation complete (use dnschecker.org)
- Vercel shows "Valid Configuration"
- SSL certificate generated
- Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## Quick Checklist

- [ ] Domain added in Vercel
- [ ] CNAME record added in Cloudflare
- [ ] Proxy enabled (orange cloud) in Cloudflare
- [ ] DNS propagated (check dnschecker.org)
- [ ] Vercel shows "Valid Configuration"
- [ ] SSL certificate generated
- [ ] Domain loads at https://retirement-ready-vault.ai-focus.org
- [ ] `VITE_APP_URL` updated in Vercel (if using auth)
- [ ] Supabase redirect URLs updated (if using auth)

---

## Need Help?

If you encounter issues:
1. Check Vercel domain status
2. Verify DNS record in Cloudflare
3. Check DNS propagation status
4. Review Vercel deployment logs

