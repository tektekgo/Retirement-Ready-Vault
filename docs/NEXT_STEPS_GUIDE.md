# Next Steps Guide: Validating Your Calculations

This guide walks you through validating your retirement calculations step-by-step.

---

## Step 1: Install and Use the Test Framework

### What is a Test Framework?

A test framework lets you automatically verify that your code works correctly. Think of it as having a robot that checks your calculations are right.

### What Happens After Installation?

After installing the test framework, you can:
- Run automated tests that verify your calculations
- See if your code produces correct results
- Catch errors before users find them
- Show others that your calculations are validated

### How to Install

**Option A: Install Vitest (Recommended - works with Vite)**

1. Open your terminal in the project folder
2. Run this command:
   ```bash
   npm install --save-dev vitest @vitest/ui
   ```

3. Update `package.json` - add this to the `"scripts"` section:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "tsc && vite build",
     "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
     "preview": "vite preview",
     "test": "vitest",
     "test:ui": "vitest --ui"
   }
   ```

### How to Use It

**Run Tests:**
```bash
npm test
```

**Run Tests with Visual Interface:**
```bash
npm run test:ui
```

**What You'll See:**

When you run `npm test`, it will:
1. Find all test files (files ending in `.test.ts` or `.spec.ts`)
2. Run each test
3. Show you which tests passed ✅ and which failed ❌
4. Show any errors

**Example Output:**
```
✓ Basic Analysis - Formula Validation (5 tests)
  ✓ should calculate required income as 75% of expenses
  ✓ should calculate total needed for 30 years correctly
  ✓ should calculate readiness score correctly
  ✓ should cap readiness score at 100%
  ✓ should use 80% rule for required income

✓ Intermediate Analysis - 4% Rule Validation (4 tests)
  ✓ should calculate 4% withdrawal correctly
  ✓ should add Social Security to projected income
  ...

Test Files: 1 passed (1)
Tests: 15 passed (15)
```

**What This Means:**

- ✅ **All tests pass** = Your calculations are working correctly
- ❌ **Tests fail** = There's a bug that needs fixing

**You Don't Have to Install This Right Now**

The test file I created (`src/services/__tests__/retirementCalculations.test.ts`) is there for when you're ready. You can:
- Use it later when you want to add automated testing
- Show it to others as proof you have validation tests
- Run it manually by copying scenarios into your app

**For now, you can skip this step** and focus on manual validation (Step 2).

---

## Step 2: Manual Comparisons (This is the Important One!)

### What Are Manual Comparisons?

Manual comparisons mean testing your app's results against other trusted retirement calculators to make sure they match (or are close).

### Why This Matters

When someone asks "How do you know your calculations are accurate?", you can say:
- "I tested the same scenario on FireCalc and got similar results"
- "I verified the 4% rule calculation manually"
- "I compared with Vanguard's calculator"

This proves your calculations are correct!

---

### A. Using FireCalc.com (FREE - No Account Needed)

**What is FireCalc?**
- Free retirement calculator used by financial planners
- Industry standard for retirement planning
- Uses historical market data

**How to Use It:**

1. **Go to:** https://www.firecalc.com/

2. **Enter Your Test Scenario:**
   - **Starting Portfolio:** $1,000,000
   - **Annual Spending:** $48,000 (that's $4,000/month × 12)
   - **Years to Retirement:** 20 (if you're 45 and retiring at 65)
   - **Years in Retirement:** 30

3. **Click "Submit"**

4. **Compare Results:**
   - FireCalc will show success rate (e.g., "95% success rate")
   - Your Advanced (Monte Carlo) method should show similar percentage
   - If FireCalc says 85% success, your app should show around 80-90% (some variance is normal)

**Example Test:**

**Your App Input:**
- Age: 45
- Retire at: 65
- Monthly Expenses: $5,000
- Assets: $1,000,000
- Social Security: $2,000/month

**FireCalc Input:**
- Starting Portfolio: $1,000,000
- Annual Spending: $60,000 ($5,000 × 12, but subtract Social Security: $60,000 - $24,000 = $36,000)
- Actually, better: Annual Spending = $36,000 (expenses minus Social Security)

**What to Compare:**
- FireCalc success rate vs. your Advanced method readiness score
- Should be similar (within 5-10% is normal)

---

### B. Using Vanguard Retirement Planner (FREE - Account Needed)

**What is Vanguard Retirement Planner?**
- Free retirement calculator from Vanguard (major investment company)
- Uses Monte Carlo simulation
- Requires free Vanguard account

**How to Use It:**

1. **Create Free Account:**
   - Go to: https://investor.vanguard.com/
   - Click "Open an account" (it's free, no investment required)
   - Or use existing account if you have one

2. **Access Retirement Planner:**
   - Log in
   - Go to "Planning & Advice" → "Retirement Planner"
   - Or search for "Retirement Planner"

3. **Enter Same Scenario:**
   - Current age: 45
   - Retirement age: 65
   - Current savings: $1,000,000
   - Monthly expenses in retirement: $4,000 (80% of $5,000)
   - Social Security: $2,000/month

4. **Compare Results:**
   - Vanguard will show retirement readiness percentage
   - Compare with your Intermediate or Advanced method
   - Should be similar

**Note:** Vanguard's interface may vary, but the concept is the same - enter your scenario and compare results.

---

### C. Manual 4% Rule Verification (No Tools Needed!)

**What is the 4% Rule?**

The 4% rule says: You can safely withdraw 4% of your retirement savings each year without running out of money.

**How to Verify Manually:**

**Example Scenario:**
- Total Assets: $1,000,000
- Monthly Expenses: $5,000

**Step 1: Calculate 4% Annual Withdrawal**
```
4% of $1,000,000 = $1,000,000 × 0.04 = $40,000 per year
```

**Step 2: Convert to Monthly**
```
$40,000 ÷ 12 months = $3,333.33 per month
```

**Step 3: Calculate Required Income (80% rule)**
```
80% of $5,000 = $5,000 × 0.8 = $4,000 per month
```

**Step 4: Add Other Income (Social Security)**
```
$3,333 (withdrawal) + $2,000 (Social Security) = $5,333 per month
```

**Step 5: Compare**
```
Projected Income: $5,333/month
Required Income: $4,000/month
Gap: $5,333 - $4,000 = +$1,333 (positive = good!)
Readiness: ($5,333 / $4,000) × 100 = 133% (capped at 100%)
```

**Now Check Your App:**

1. Enter the same scenario in your app
2. Select "Intermediate Method"
3. Check the results:
   - Projected Monthly Income should be around $5,333
   - Required Monthly Income should be $4,000
   - Readiness Score should be 100% (since it's capped)

**If They Match:** ✅ Your calculation is correct!

**If They Don't Match:** Check for bugs in your code.

---

### Quick Test Scenarios to Try

**Scenario 1: Standard Retirement**
- Age: 45
- Retire: 65
- Expenses: $5,000/month
- Assets: $1,000,000
- Social Security: $2,000/month

**Expected Results:**
- Basic Method: ~50-60% readiness
- Intermediate Method: ~100% readiness (capped)
- Advanced Method: ~80-90% readiness

**Scenario 2: High Savings**
- Same as above but Assets: $3,000,000

**Expected Results:**
- All methods should show high readiness (>80%)

**Scenario 3: Low Savings**
- Same as above but Assets: $300,000

**Expected Results:**
- All methods should show low readiness (<50%)

---

## Step 3: What is the Test File?

### What is `retirementCalculations.test.ts`?

This is a file I created that contains **automated tests** for your calculation functions.

**Location:** `src/services/__tests__/retirementCalculations.test.ts`

### What Does It Do?

It contains test cases that:
1. **Test Basic Method:**
   - Verifies 75% rule calculation
   - Checks total needed calculation
   - Validates readiness score

2. **Test Intermediate Method:**
   - Verifies 4% withdrawal calculation
   - Checks Social Security addition
   - Validates readiness score

3. **Test Advanced Method:**
   - Verifies Monte Carlo runs correctly
   - Tests high/low savings scenarios
   - Validates results are in correct range

### How Can You Use It?

**Option 1: Run It (After Installing Test Framework)**
```bash
npm test
```

**Option 2: Use It as Documentation**
- Show it to others as proof you have validation tests
- Use the test scenarios as examples
- Reference it when explaining your validation process

**Option 3: Manual Testing**
- Copy the test scenarios from the file
- Enter them manually in your app
- Verify results match expected values

### Example from the Test File:

```typescript
it('should calculate 4% withdrawal correctly', () => {
  const data = createTestData({
    assets: {
      retirement401k: 1000000, // $1M
      // ... other assets are 0
    },
  });

  const result = calculateIntermediateAnalysis(data);
  
  // Expected: 4% of $1M = $40,000/year = $3,333.33/month
  const expectedMonthlyWithdrawal = (1000000 * 0.04) / 12;
  
  // Check if result matches
  expect(result.projectedMonthlyIncome).toBeCloseTo(expectedMonthlyWithdrawal, 0);
});
```

**What This Test Does:**
- Creates test data with $1M in assets
- Runs your Intermediate calculation
- Checks if the result equals $3,333/month (4% of $1M ÷ 12)

**You Can Do This Manually:**
1. Open your app
2. Enter: $1M assets, $0 expenses (to isolate the calculation)
3. Select Intermediate method
4. Check if projected income = $3,333/month
5. If yes: ✅ Test passes!

---

## Recommended Order of Steps

### For Immediate Validation (Do This First):

1. ✅ **Manual 4% Rule Verification** (Step 2C) - Takes 5 minutes, no tools needed
2. ✅ **Test with FireCalc** (Step 2A) - Takes 10 minutes, free, no account needed
3. ⏭️ **Vanguard** (Step 2B) - Optional, requires account setup
4. ⏭️ **Test Framework** (Step 1) - Can do later when you want automated testing

### Why This Order?

- **Manual verification** proves you understand the math
- **FireCalc comparison** proves your results match industry tools
- **Test framework** is nice-to-have for ongoing validation

---

## Quick Start: Validate Right Now (5 Minutes)

**Test Your 4% Rule Calculation:**

1. Open your app
2. Enter this scenario:
   - Assets: $1,000,000
   - Expenses: $5,000/month
   - Social Security: $2,000/month
3. Select "Intermediate Method"
4. Check results:
   - Projected Income should be around $5,333/month
   - Required Income should be $4,000/month
   - Readiness should be 100%

**Manual Calculation:**
- 4% of $1M = $40,000/year = $3,333/month
- Plus Social Security: $3,333 + $2,000 = $5,333/month
- Required (80% of $5,000): $4,000/month
- Readiness: ($5,333 / $4,000) × 100 = 133% → capped at 100%

**If they match:** ✅ You're validated!

---

## Summary

- **Step 1 (Test Framework):** Optional - for automated testing later
- **Step 2 (Manual Comparisons):** **DO THIS** - proves your calculations work
  - FireCalc: Free, no account, industry standard
  - Vanguard: Free but needs account, good for comparison
  - Manual 4% rule: Quickest validation, no tools needed
- **Step 3 (Test File):** Documentation/proof you have validation tests

**Start with Step 2C (Manual 4% Rule) - it takes 5 minutes and proves your calculations work!**

