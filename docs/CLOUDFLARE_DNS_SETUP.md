# Cloudflare DNS Setup - Step 4

Complete guide for configuring Cloudflare DNS to point to Vercel.

---

## Prerequisites

- ✅ Vercel deployment complete
- ✅ Custom domain added in Vercel
- ✅ Environment variables configured
- ✅ Domain: `retirement-ready-vault.ai-focus.org`

---

## Step-by-Step Instructions

### Part 1: Get DNS Info from Vercel

1. **Go to Vercel Dashboard**
   - Open your project
   - Go to **Settings** → **Domains**

2. **Add Domain (if not already added)**
   - Enter: `retirement-ready-vault.ai-focus.org`
   - Click **"Add"**

3. **View DNS Instructions**
   - Vercel will show DNS configuration needed
   - You'll see something like:
     ```
     Type: CNAME
     Name: retirement-ready-vault
     Value: cname.vercel-dns.com
     ```
   - **Note:** The exact value may differ - use what Vercel shows you

---

### Part 2: Configure Cloudflare DNS

1. **Login to Cloudflare**
   - Go to: https://dash.cloudflare.com
   - Select domain: `ai-focus.org`

2. **Go to DNS Settings**
   - Click **"DNS"** in left sidebar
   - Click **"Records"** tab

3. **Add CNAME Record**
   - Click **"Add record"** button
   - Configure:
     ```
     Type: CNAME
     Name: retirement-ready-vault
     Target: [Use value from Vercel - e.g., cname.vercel-dns.com]
     Proxy status: Proxied (orange cloud) ✅
     TTL: Auto
     ```
   - Click **"Save"**

4. **Verify Record**
   - You should see new record:
     ```
     retirement-ready-vault.ai-focus.org  CNAME  cname.vercel-dns.com  Proxied
     ```

---

### Part 3: Wait for Propagation

1. **DNS Propagation**
   - Usually takes 5-60 minutes
   - Can take up to 24 hours (rare)

2. **Check Status in Vercel**
   - Go back to Vercel → Settings → Domains
   - Status should change from "Pending" to "Valid Configuration"
   - SSL certificate will auto-generate (may take 5-10 minutes)

3. **Test Domain**
   - Visit: `https://retirement-ready-vault.ai-focus.org`
   - Should load your app
   - Should show SSL padlock 🔒

---

## Important Notes

### Proxy Status (Orange Cloud)

**✅ Proxied (Recommended):**
- Cloudflare CDN enabled
- DDoS protection
- Better performance
- SSL handled by Cloudflare

**⚠️ DNS Only (Gray Cloud):**
- Direct connection
- No Cloudflare benefits
- SSL handled by Vercel

**Recommendation:** Keep Proxied (orange cloud) ✅

---

### SSL Certificate

- Vercel will automatically provision SSL certificate
- Takes 5-10 minutes after DNS is configured
- No manual action needed
- Certificate auto-renews

---

### Troubleshooting

**Domain Not Working?**

1. **Check DNS Record:**
   ```bash
   # Run in terminal
   dig retirement-ready-vault.ai-focus.org
   # or
   nslookup retirement-ready-vault.ai-focus.org
   ```
   Should show CNAME pointing to Vercel

2. **Check Vercel Status:**
   - Settings → Domains
   - Should show "Valid Configuration"
   - If "Invalid Configuration", check DNS record

3. **Check Cloudflare:**
   - DNS record exists
   - Target matches Vercel value
   - Proxy enabled (orange cloud)

4. **Wait Longer:**
   - DNS can take up to 24 hours
   - Usually works within 1 hour

**SSL Not Working?**

- Wait 5-10 minutes after DNS is configured
- Check Vercel → Domains → SSL status
- Should show "Valid Certificate"

**App Not Loading?**

- Check Vercel deployment is successful
- Check environment variables are set
- Check build logs in Vercel

---

## Verification Checklist

After setup, verify:

- [ ] DNS record added in Cloudflare
- [ ] CNAME target matches Vercel value
- [ ] Proxy enabled (orange cloud)
- [ ] Vercel shows "Valid Configuration"
- [ ] Domain loads: `https://retirement-ready-vault.ai-focus.org`
- [ ] SSL certificate active (padlock icon)
- [ ] App functionality works (login, registration, etc.)

---

## Next Steps After DNS Setup

1. ✅ Test domain access
2. ✅ Test registration with invite code
3. ✅ Test email verification links
4. ✅ Test password reset
5. ✅ Monitor Supabase for new signups
6. ✅ Share invite code with trusted users

---

## Quick Reference

**Cloudflare DNS Record:**
```
Type: CNAME
Name: retirement-ready-vault
Target: [Vercel-provided value]
Proxy: Enabled (orange cloud)
```

**Vercel Domain:**
```
Domain: retirement-ready-vault.ai-focus.org
Status: Valid Configuration
SSL: Auto-provisioned
```

**Test URL:**
```
https://retirement-ready-vault.ai-focus.org
```

---

Ready to proceed? Let me know when you've:
1. ✅ Verified all environment variables in Vercel
2. ✅ Added domain in Vercel
3. ✅ Ready to configure Cloudflare DNS

Then we'll complete Step 4!

