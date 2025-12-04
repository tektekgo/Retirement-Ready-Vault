# Supabase Redirect URLs Configuration

Guide to configure Supabase authentication redirect URLs for your custom domain.

---

## Step 1: Navigate to URL Configuration

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project

2. **Go to Authentication Settings**
   - Click **Authentication** in the left sidebar
   - Click **URL Configuration** (under "Configuration" section)

---

## Step 2: Configure Site URL

1. **Find "Site URL" field**
   - This is the base URL for your application

2. **Update Site URL:**
   ```
   https://retirement-ready-vault.ai-focus.org
   ```

3. **Click "Save"** (if there's a save button, or it auto-saves)

---

## Step 3: Add Redirect URLs

1. **Find "Redirect URLs" section**
   - This is usually a text area or list where you can add multiple URLs

2. **Add these URLs (one per line or comma-separated):**
   ```
   https://retirement-ready-vault.ai-focus.org/auth/callback
   https://retirement-ready-vault.ai-focus.org/auth/reset-password
   ```

   **Why these URLs?**
   - `/auth/callback` - Used for email verification and magic link sign-in
   - `/auth/reset-password` - Used for password reset flows

3. **Also add your Vercel domain (for testing/fallback):**
   ```
   https://retirement-ready-vault.vercel.app/auth/callback
   https://retirement-ready-vault.vercel.app/auth/reset-password
   ```

4. **Click "Save"** or wait for auto-save

---

## Step 4: Understanding Email Verification (Currently Disabled)

Based on your screenshot, **"Confirm email" is currently disabled**. This means:

- ✅ Users can sign up and immediately log in (no email verification required)
- ✅ Good for testing
- ⚠️ Less secure for production

### When you're ready to enable email verification:

1. **Go to Authentication → Providers → Email**
2. **Enable "Confirm email" toggle**
3. **Users will then need to verify their email before first login**
4. **Verification emails will redirect to:** `https://retirement-ready-vault.ai-focus.org/auth/callback`

---

## Complete URL Configuration Example

**Site URL:**
```
https://retirement-ready-vault.ai-focus.org
```

**Redirect URLs:**
```
https://retirement-ready-vault.ai-focus.org/auth/callback
https://retirement-ready-vault.ai-focus.org/auth/reset-password
https://retirement-ready-vault.vercel.app/auth/callback
https://retirement-ready-vault.vercel.app/auth/reset-password
http://localhost:5173/auth/callback
http://localhost:5173/auth/reset-password
```

*(The localhost URLs are optional but helpful for local development)*

---

## Step-by-Step Visual Guide

### In Supabase Dashboard:

1. **Authentication** → **URL Configuration**

2. **Site URL field:**
   - Enter: `https://retirement-ready-vault.ai-focus.org`

3. **Redirect URLs field:**
   - Add each URL on a new line or separated by commas
   - Include both your custom domain and Vercel domain

4. **Save changes**

---

## Testing After Configuration

1. **Test Registration:**
   - Go to: `https://retirement-ready-vault.ai-focus.org/register`
   - Sign up with a test email
   - (Since email verification is disabled, you'll be able to log in immediately)

2. **Test Password Reset:**
   - Go to: `https://retirement-ready-vault.ai-focus.org/auth/forgot-password`
   - Enter your email
   - Check email for reset link
   - Click link → should redirect to: `https://retirement-ready-vault.ai-focus.org/auth/reset-password`

3. **Test Magic Link (if enabled):**
   - Magic link emails will redirect to: `https://retirement-ready-vault.ai-focus.org/auth/callback`

---

## Important Notes

### Wildcard URLs
Supabase also supports wildcards for subdomains:
```
https://*.ai-focus.org/auth/callback
```
But it's better to be specific for security.

### Local Development
If you're testing locally, you can also add:
```
http://localhost:5173/auth/callback
http://localhost:5173/auth/reset-password
```

### Email Verification
- Currently disabled (good for testing)
- When you enable it, verification emails will use `/auth/callback`
- Make sure this URL is in your redirect URLs list

---

## Troubleshooting

### "Invalid redirect URL" error
- Check that the exact URL is in the Redirect URLs list
- URLs are case-sensitive
- Must include `https://` (or `http://` for localhost)
- No trailing slash (unless your route has one)

### Email links not working
- Verify redirect URL is in the list
- Check Site URL matches your domain
- Check spam folder
- Verify email verification is enabled/disabled as expected

### Password reset not working
- Verify `/auth/reset-password` is in redirect URLs
- Check that `VITE_APP_URL` is set in Vercel environment variables

---

## Quick Checklist

- [ ] Site URL set to: `https://retirement-ready-vault.ai-focus.org`
- [ ] Redirect URL added: `https://retirement-ready-vault.ai-focus.org/auth/callback`
- [ ] Redirect URL added: `https://retirement-ready-vault.ai-focus.org/auth/reset-password`
- [ ] Vercel domain URLs added (for fallback)
- [ ] Localhost URLs added (optional, for development)
- [ ] Changes saved
- [ ] Tested registration flow
- [ ] Tested password reset flow

---

## Next Steps

1. ✅ Configure redirect URLs (you're doing this now)
2. ⏭️ Update `VITE_APP_URL` in Vercel (if not already done)
3. ⏭️ Test authentication flows
4. ⏭️ Enable email verification when ready for production

