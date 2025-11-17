# Invite Code System - Setup Guide

## Overview

The Retirement Ready Vault application uses an **invite code system** to restrict account creation to only trusted users. This is a simple, low-maintenance solution that doesn't require database changes or admin panels.

---

## How It Works

1. **User tries to register** → Must enter an invite code
2. **Code is validated** → Checked against configured codes
3. **If valid** → Account creation proceeds
4. **If invalid** → Registration is blocked with friendly error

---

## Setup Instructions

### Step 1: Set Invite Codes in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add the following:

   **Name:** `VITE_INVITE_CODES`
   
   **Value:** Your invite code(s)
   - Single code: `MYCODE123`
   - Multiple codes: `CODE1,CODE2,CODE3` (comma-separated)
   - Codes are case-insensitive (MYCODE = mycode = MyCode)

5. Select **Production**, **Preview**, and **Development** (or just Production if you prefer)
6. Click **Save**

### Step 2: Redeploy

- Vercel will automatically redeploy when you add environment variables
- Or manually trigger a redeploy from the Deployments tab

### Step 3: Share Codes with Trusted Users

Share your invite code(s) with people you want to allow access:
- Via email
- Via secure message
- Via password manager shared vault
- In person

---

## Code Examples

### Single Code
```
VITE_INVITE_CODES=RETIRE2025
```

### Multiple Codes (Different for Different People)
```
VITE_INVITE_CODES=FAMILY2025,FRIENDS2025,COLLEAGUES2025
```

### Complex Codes
```
VITE_INVITE_CODES=RRV-2025-ABC123,RRV-2025-XYZ789
```

---

## Updating Codes

### To Change Codes:

1. Go to Vercel → Settings → Environment Variables
2. Edit `VITE_INVITE_CODES`
3. Update the value(s)
4. Save (auto-redeploys)

### To Add New Codes:

1. Edit `VITE_INVITE_CODES`
2. Add new code(s) separated by commas
3. Example: `OLDCODE1,OLDCODE2,NEWCODE3`
4. Save

### To Remove Codes:

1. Edit `VITE_INVITE_CODES`
2. Remove the code(s) you don't want
3. Save

**Note:** Users who already registered can still log in even if their code is removed. Codes only affect new registrations.

---

## Security Considerations

### ✅ What This Provides:

- **Access Control:** Only people with codes can register
- **Easy Management:** Update codes via environment variables
- **No Database:** No need to manage user lists
- **Simple Sharing:** Just share the code

### ⚠️ Limitations:

- **Code Sharing:** If someone shares a code, others can use it
- **No Expiration:** Codes don't expire automatically
- **No Tracking:** Can't see who used which code
- **Case Insensitive:** `CODE123` = `code123` = `Code123`

### 🔒 Best Practices:

1. **Use Strong Codes:** Don't use obvious codes like "password" or "1234"
2. **Rotate Periodically:** Change codes every few months
3. **Different Codes:** Use different codes for different groups
4. **Secure Sharing:** Share codes via secure channels
5. **Monitor Usage:** Check Supabase dashboard for new signups

---

## Alternative: Email Domain Whitelist

If you want to restrict by email domain instead (e.g., only `@yourcompany.com`), you can modify the validation logic. This is more restrictive but requires code changes.

**Example:** Only allow emails ending in `@trusteddomain.com`

---

## Troubleshooting

### Code Not Working?

1. **Check Environment Variable:**
   - Verify `VITE_INVITE_CODES` is set in Vercel
   - Check it's deployed to the right environment

2. **Check Code Format:**
   - No extra spaces
   - Comma-separated for multiple codes
   - Case doesn't matter

3. **Redeploy:**
   - Environment variables require redeploy
   - Check Vercel deployment logs

### Registration Still Open?

If registration works without a code:
- `VITE_INVITE_CODES` might not be set
- Check Vercel environment variables
- Verify deployment includes the variable

### Want to Disable Codes Temporarily?

1. Remove or clear `VITE_INVITE_CODES` in Vercel
2. Redeploy
3. Registration will be open (for development/testing)

---

## Future Enhancements

If you need more control later, consider:

1. **Code Expiration:** Add expiration dates to codes
2. **Usage Tracking:** Track which codes are used
3. **Admin Panel:** Web interface to manage codes
4. **Email Whitelist:** Restrict by email domain
5. **One-Time Codes:** Codes that expire after first use

---

## Quick Reference

**Environment Variable:** `VITE_INVITE_CODES`

**Format:** `CODE1,CODE2,CODE3` (comma-separated, case-insensitive)

**Where to Set:** Vercel → Settings → Environment Variables

**When It Takes Effect:** After redeploy

**How to Update:** Edit environment variable → Save → Auto-redeploy

---

## Example Workflow

1. **Initial Setup:**
   ```
   VITE_INVITE_CODES=RRV2025INITIAL
   ```
   Share with first trusted users

2. **Add More Users:**
   ```
   VITE_INVITE_CODES=RRV2025INITIAL,RRV2025BATCH2
   ```
   Share new code with next group

3. **Rotate Codes:**
   ```
   VITE_INVITE_CODES=RRV2025NEW,RRV2025BATCH2
   ```
   Remove old code, add new one

4. **Multiple Groups:**
   ```
   VITE_INVITE_CODES=FAMILY2025,FRIENDS2025,WORK2025
   ```
   Different codes for different groups

---

## Summary

The invite code system provides:
- ✅ **Simple** - Just set environment variable
- ✅ **Low Maintenance** - Update codes in Vercel
- ✅ **Flexible** - Multiple codes supported
- ✅ **Secure** - Only people with codes can register
- ✅ **No Database** - No admin panel needed

Perfect for restricting access to trusted users without administrative overhead!

