# Pre-Production Testing Guide

Comprehensive testing checklist before enabling email verification and broader launch.

---

## Testing Environment

**Test Domain:** `https://retirement-ready-vault.ai-focus.org`  
**Test Account:** Create a test email account (e.g., `test@example.com`)  
**Invite Code:** Use your configured invite code

---

## Test 1: Registration Flow ✅

### Steps:
1. Navigate to: `https://retirement-ready-vault.ai-focus.org/register`
2. Fill in registration form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com` (use a real email you can access)
   - Invite Code: [Your invite code]
   - Password: `Test123!@#` (meets requirements)
   - Confirm Password: `Test123!@#`
3. Click "Create Account"

### Expected Results:
- [ ] Form validates correctly (password requirements, matching passwords)
- [ ] Invite code validation works
- [ ] Success message appears: "Check Your Email"
- [ ] Email received (even though verification is disabled, you should get a welcome email)
- [ ] Can navigate to login page
- [ ] **Note:** Since email verification is disabled, you can log in immediately

### Issues to Check:
- [ ] Form validation errors display correctly
- [ ] Invalid invite code shows error
- [ ] Password requirements enforced
- [ ] No console errors

---

## Test 2: Login Flow ✅

### Steps:
1. Navigate to: `https://retirement-ready-vault.ai-focus.org/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `Test123!@#`
3. Click "Sign In"

### Expected Results:
- [ ] Login successful
- [ ] Redirected to `/home` (Landing Page)
- [ ] No loading spinner delay
- [ ] User email displayed in header
- [ ] Privacy banner visible (collapsed by default)

### Issues to Check:
- [ ] Invalid credentials show error
- [ ] No unexpected redirects
- [ ] Session persists on page refresh
- [ ] No console errors

---

## Test 3: Password Reset Flow ✅

### Steps:
1. Navigate to: `https://retirement-ready-vault.ai-focus.org/auth/forgot-password`
2. Enter email: `test@example.com`
3. Click "Send Reset Link"
4. Check email inbox
5. Click reset link in email
6. Enter new password: `NewTest123!@#`
7. Confirm new password: `NewTest123!@#`
8. Submit

### Expected Results:
- [ ] Success message: "Check your email"
- [ ] Email received with reset link
- [ ] Reset link redirects to: `https://retirement-ready-vault.ai-focus.org/auth/reset-password`
- [ ] Can set new password
- [ ] Can log in with new password

### Issues to Check:
- [ ] Email link uses correct domain (not localhost or vercel.app)
- [ ] Reset page loads correctly
- [ ] Password validation works
- [ ] Old password no longer works
- [ ] New password works for login

---

## Test 4: Wizard Completion Flow ✅

### Steps:
1. Log in
2. Navigate to `/wizard` or click "Begin Planning" / "Edit Planning Data"
3. Complete all 5 steps:

   **Step 1: Personal Info**
   - Name: `Test User`
   - Age: `35`
   - Target Retirement Age: `65`
   - Click "Next"

   **Step 2: Expenses**
   - Fill in some expense values (e.g., Housing: `2000`, Food: `500`)
   - Click "Next"

   **Step 3: Assets**
   - Fill in some asset values (e.g., 401k: `50000`, Savings: `10000`)
   - Click "Next"

   **Step 4: Income Sources**
   - Current Salary: `75000`
   - Social Security (optional)
   - Click "Next"

   **Step 5: Risk Assessment**
   - Answer all 4 questions
   - Click "Complete"

### Expected Results:
- [ ] Can navigate between steps
- [ ] Data saves automatically (check localStorage)
- [ ] Progress persists on page refresh
- [ ] "Complete" button shows loading spinner while saving
- [ ] Redirects to `/dashboard` after completion
- [ ] No data loss

### Issues to Check:
- [ ] Form validation works
- [ ] Back button works correctly
- [ ] Data persists in localStorage
- [ ] Data saves to database (if logged in)
- [ ] No console errors
- [ ] Privacy banner visible and collapsible

---

## Test 5: Dashboard Functionality ✅

### Steps:
1. After completing wizard, verify dashboard loads
2. Test all analysis methods:
   - Click "Basic (70-80% Rule)"
   - Click "Intermediate (4% Rule)"
   - Click "Advanced (Monte Carlo)"
3. Check all sections:
   - Readiness Score
   - Projected Income
   - Required Income
   - Gap
   - Charts (Retirement Projection, Expense Breakdown, Asset Allocation)
   - Key Metrics
   - Recommendations

### Expected Results:
- [ ] Dashboard loads without spinner delay
- [ ] All three analysis methods work
- [ ] Analysis method explanations show correctly
- [ ] Hover tooltips work on analysis buttons
- [ ] Charts render correctly
- [ ] Name and date display correctly (if provided)
- [ ] All metrics calculate correctly

### Issues to Check:
- [ ] Analysis methods switch correctly
- [ ] Calculations are accurate
- [ ] Charts display properly
- [ ] No console errors
- [ ] Privacy banner visible

---

## Test 6: Data Persistence ✅

### Steps:
1. Complete wizard with test data
2. Log out
3. Log back in
4. Navigate to `/home`
5. Check if "Continue Planning" option shows
6. Navigate to `/dashboard`
7. Verify data is still there

### Expected Results:
- [ ] Data persists after logout/login
- [ ] Landing page shows "Continue Planning" option
- [ ] Dashboard shows previous data
- [ ] Can edit existing data

### Issues to Check:
- [ ] Data loads from database (not just localStorage)
- [ ] No data loss on logout/login
- [ ] Can update existing data
- [ ] Data syncs between browser and database

---

## Test 7: Export Features ✅

### Steps:
1. From Dashboard, test all export options:
   - Click "Export Dashboard as PDF"
   - Click "Export to CSV"
   - Click "Export Report as PDF (Text Only)"
2. From Landing Page (if has data):
   - Test "Export Report as PDF (Text Only)"
   - Test "Export as CSV"

### Expected Results:
- [ ] PDF exports generate correctly
- [ ] CSV exports generate correctly
- [ ] Dashboard PDF includes charts/images
- [ ] Text PDF includes all data
- [ ] Files download with correct names
- [ ] No errors during export

### Issues to Check:
- [ ] PDF generation doesn't hang
- [ ] CSV format is correct
- [ ] All data included in exports
- [ ] File names are appropriate
- [ ] No console errors

---

## Test 8: Navigation Flows ✅

### Steps:
1. Test all navigation links:
   - Home → Dashboard
   - Dashboard → Home
   - Dashboard → Edit Data (Wizard)
   - Wizard → Home
   - Wizard → Dashboard
   - Landing Page → Dashboard
   - Landing Page → Wizard

### Expected Results:
- [ ] All navigation works correctly
- [ ] No loading spinners on navigation
- [ ] Correct pages load
- [ ] Browser back/forward buttons work
- [ ] No broken links

### Issues to Check:
- [ ] No 404 errors
- [ ] No unexpected redirects
- [ ] Navigation is smooth
- [ ] URLs are correct

---

## Test 9: Privacy Banner ✅

### Steps:
1. Navigate to any page with privacy banner
2. Test banner functionality:
   - Click banner header → should expand
   - Click "Got it, thanks!" → should collapse
   - Refresh page → should stay collapsed

### Expected Results:
- [ ] Banner visible on all pages
- [ ] Banner expands on click
- [ ] Banner collapses on "Got it, thanks!"
- [ ] Banner stays collapsed after refresh
- [ ] Chevron icon rotates correctly

### Issues to Check:
- [ ] Banner doesn't disappear completely
- [ ] Expand/collapse animations work
- [ ] No console errors

---

## Test 10: Data Management ✅

### Steps:
1. Test "Clear All Data" functionality:
   - From Landing Page: Click "Clear All Data"
   - Confirm deletion
   - Verify data is cleared
   - Try to access dashboard → should show "No Data Yet"
2. Test "Start Fresh" functionality:
   - Complete wizard again
   - Verify new data saves correctly

### Expected Results:
- [ ] Clear All Data works
- [ ] Confirmation dialog appears
- [ ] Data cleared from localStorage
- [ ] Data cleared from database (if logged in)
- [ ] Can start fresh after clearing
- [ ] No errors during clearing

### Issues to Check:
- [ ] Confirmation dialog works
- [ ] Data actually clears
- [ ] Can create new data after clearing
- [ ] No console errors

---

## Test 11: Logout Flow ✅

### Steps:
1. Log in
2. Complete some actions (e.g., view dashboard)
3. Click "Logout"
4. Verify logout

### Expected Results:
- [ ] Logout successful
- [ ] Redirected to `/login`
- [ ] Session cleared
- [ ] Cannot access protected routes
- [ ] Data remains (for next login)

### Issues to Check:
- [ ] Logout doesn't hang
- [ ] Session properly cleared
- [ ] Redirects correctly
- [ ] Protected routes require login

---

## Test 12: Error Handling ✅

### Steps:
1. Test invalid scenarios:
   - Try to access `/dashboard` without login → should redirect to login
   - Try to access `/wizard` without login → should redirect to login
   - Enter invalid email format
   - Enter weak password
   - Try to register with existing email
   - Try to login with wrong password

### Expected Results:
- [ ] Protected routes redirect to login
- [ ] Form validation shows errors
- [ ] Error messages are user-friendly
- [ ] No crashes or blank pages
- [ ] Console shows helpful error messages (for debugging)

### Issues to Check:
- [ ] Error messages are clear
- [ ] No unhandled errors
- [ ] App doesn't crash
- [ ] User can recover from errors

---

## Test 13: Mobile/Responsive Design ✅

### Steps:
1. Test on mobile device or browser dev tools (mobile view)
2. Test key flows:
   - Registration
   - Login
   - Wizard completion
   - Dashboard viewing
   - Navigation

### Expected Results:
- [ ] Forms are usable on mobile
- [ ] Navigation works on mobile
- [ ] Charts display correctly
- [ ] Text is readable
- [ ] Buttons are tappable
- [ ] No horizontal scrolling

### Issues to Check:
- [ ] Layout doesn't break
- [ ] Touch targets are adequate
- [ ] Forms are mobile-friendly
- [ ] Dashboard is usable on mobile

---

## Test 14: Performance ✅

### Steps:
1. Test page load times
2. Test with slow network (throttle in dev tools)
3. Test data loading
4. Test export generation

### Expected Results:
- [ ] Pages load quickly (< 3 seconds)
- [ ] No long loading spinners
- [ ] Data loads efficiently
- [ ] Exports generate in reasonable time

### Issues to Check:
- [ ] No unnecessary API calls
- [ ] Data caching works
- [ ] No performance bottlenecks
- [ ] Smooth user experience

---

## Test 15: Browser Compatibility ✅

### Steps:
1. Test in different browsers:
   - Chrome
   - Firefox
   - Safari
   - Edge
2. Test key flows in each

### Expected Results:
- [ ] App works in all modern browsers
- [ ] No browser-specific errors
- [ ] Features work consistently

### Issues to Check:
- [ ] CSS renders correctly
- [ ] JavaScript works
- [ ] No browser console errors
- [ ] Consistent behavior

---

## Critical Issues Checklist

Before enabling email verification, ensure:

- [ ] No critical bugs found
- [ ] All core features work
- [ ] Data persistence works correctly
- [ ] Navigation is smooth
- [ ] Error handling is robust
- [ ] Mobile experience is acceptable
- [ ] Performance is acceptable
- [ ] No security issues found

---

## Testing Sign-Off

**Tester:** _________________  
**Date:** _________________  
**Environment:** Production (`https://retirement-ready-vault.ai-focus.org`)  
**Invite Code:** _________________  

**Status:**
- [ ] All tests passed
- [ ] Critical issues resolved
- [ ] Ready to enable email verification
- [ ] Ready for broader launch

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

## Next Steps After Testing

1. ✅ Complete all tests above
2. ✅ Fix any critical issues found
3. ✅ Document any known limitations
4. ✅ Enable email verification in Supabase
5. ✅ Test email verification flow
6. ✅ Share with trusted beta users
7. ✅ Monitor for issues
8. ✅ Plan broader launch

---

## Quick Test Script (30 minutes)

If you're short on time, focus on these critical tests:

1. **Registration** → **Login** → **Wizard Completion** → **Dashboard** (15 min)
2. **Password Reset** (5 min)
3. **Data Persistence** (logout/login) (5 min)
4. **Export Features** (5 min)

If these work, you're in good shape! 🎉

