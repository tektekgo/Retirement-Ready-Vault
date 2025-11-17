# Vercel Environment Variables - Verification Checklist

## ✅ Required Variables for Production

### 1. VITE_SUPABASE_URL
```
Value: https://cqwuursyoonmbczzqtnl.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development
```
**Status:** ✅ You have this

---

### 2. VITE_SUPABASE_ANON_KEY
```
Value: [Your anon key from .env file]
Environments: ✅ Production, ✅ Preview, ✅ Development
```
**Status:** ✅ You have this in .env

**Action:** Copy the exact value from your `.env` file and paste into Vercel

---

### 3. VITE_INVITE_CODES
```
Value: [Your invite code(s)]
Environments: ✅ Production (required), ⚠️ Preview (optional), ⚠️ Development (optional)
```

**Format Examples:**
- Single code: `RRV2025`
- Multiple codes: `RRV2025,FAMILY2025,FRIENDS2025`
- Case doesn't matter: `rrv2025` = `RRV2025` = `Rrv2025`

**Verification:**
- ✅ No spaces around commas
- ✅ No quotes needed
- ✅ Just the code(s) separated by commas
- ✅ Can use letters, numbers, hyphens, underscores

**Example (Correct):**
```
RRV2025
```
or
```
RRV2025,FAMILY2025,WORK2025
```

**Example (Wrong):**
```
"RRV2025"          ❌ Don't use quotes
RRV2025 , FAMILY2025  ❌ No spaces around commas
RRV 2025           ❌ No spaces in code
```

**Status:** ✅ You mentioned you added this - please verify format above

---

### 4. VITE_APP_URL
```
Value: https://retirement-ready-vault.ai-focus.org
Environments: ✅ Production ONLY
```

**Important Notes:**
- ✅ Use `https://` (not `http://`)
- ✅ Use the exact domain: `retirement-ready-vault.ai-focus.org`
- ✅ Set ONLY for Production environment
- ⚠️ For Preview/Development, you can leave it unset or use localhost

**Why This Matters:**
- Used for email verification links
- Used for password reset links
- Used for magic link redirects
- Must match your actual domain

**Status:** ⚠️ Need to update - currently set to localhost

---

## 📋 Vercel Environment Variables Setup

### In Vercel Dashboard:

1. **Go to:** Project → Settings → Environment Variables

2. **Add/Edit Each Variable:**

   **Variable 1:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://cqwuursyoonmbczzqtnl.supabase.co
   Environments: ☑ Production ☑ Preview ☑ Development
   ```

   **Variable 2:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: [paste from .env file]
   Environments: ☑ Production ☑ Preview ☑ Development
   ```

   **Variable 3:**
   ```
   Name: VITE_INVITE_CODES
   Value: RRV2025
   (or multiple: RRV2025,FAMILY2025)
   Environments: ☑ Production ☐ Preview ☐ Development
   ```
   *Note: You can enable Preview/Development if you want codes there too*

   **Variable 4:**
   ```
   Name: VITE_APP_URL
   Value: https://retirement-ready-vault.ai-focus.org
   Environments: ☑ Production ☐ Preview ☐ Development
   ```
   *Note: Only Production! Leave Preview/Development empty or use localhost*

3. **Save Each Variable**

4. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or wait for auto-redeploy

---

## 🔍 Verification Steps

After setting variables:

1. **Check Variable Names:**
   - ✅ All start with `VITE_`
   - ✅ No typos
   - ✅ Exact spelling

2. **Check Values:**
   - ✅ Supabase URL: `https://cqwuursyoonmbczzqtnl.supabase.co`
   - ✅ Supabase Key: Matches your .env file
   - ✅ Invite Code: Simple code like `RRV2025` (no quotes, no spaces)
   - ✅ App URL: `https://retirement-ready-vault.ai-focus.org` (Production only)

3. **Check Environments:**
   - ✅ Supabase vars: All environments
   - ✅ Invite code: Production (at minimum)
   - ✅ App URL: Production only

4. **Test After Deploy:**
   - Try registering with invite code
   - Check email verification links work
   - Verify password reset links work

---

## ❓ Questions to Answer

1. **What invite code did you set?**
   - Please share the exact value (I can verify format)

2. **VITE_APP_URL:**
   - Did you update it to `https://retirement-ready-vault.ai-focus.org`?
   - Is it set for Production environment only?

3. **All variables added?**
   - Can you confirm all 4 variables are in Vercel?

Once confirmed, we'll proceed to Step 4 (Cloudflare DNS)!

