# Retirement Analysis Methods - Technical Explanation

## Overview

All three analysis methods are **custom implementations** written in pure TypeScript/JavaScript. **No third-party libraries** are used for calculations - only built-in JavaScript `Math` functions.

## Method 1: Basic Analysis (70-80% Rule)

### What It Does
Estimates retirement needs using a simple percentage rule of thumb.

### How It Calculates

1. **Calculate Required Income:**
   - Sums all monthly expenses (essential + discretionary)
   - Multiplies by 0.75 (75% rule - assumes you'll spend less in retirement)
   - This becomes your `requiredMonthlyIncome`

2. **Calculate Total Needed:**
   - Multiplies required monthly income by 12 (annual)
   - Multiplies by 30 (assumes 30 years in retirement)
   - Formula: `totalNeeded = requiredMonthlyIncome × 12 × 30`

3. **Calculate Readiness Score:**
   - Divides current total assets by total needed
   - Multiplies by 100 to get percentage
   - Caps at 100%: `readinessScore = min(100, (currentSavings / totalNeeded) × 100)`

4. **Calculate Projected Income:**
   - Simply divides total savings by 30 years, then by 12 months
   - Formula: `projectedMonthlyIncome = (totalAssets / 30) / 12`

### Code Location
`src/services/retirementCalculations.ts` - `calculateBasicAnalysis()` function

### Example
- Current monthly expenses: $5,000
- Required income: $5,000 × 0.75 = $3,750/month
- Total needed: $3,750 × 12 × 30 = $1,350,000
- Current savings: $500,000
- Readiness: ($500,000 / $1,350,000) × 100 = 37%

---

## Method 2: Intermediate Analysis (4% Rule)

### What It Does
Uses the proven "4% Safe Withdrawal Rate" rule, which suggests you can safely withdraw 4% of your retirement savings annually without running out of money.

### How It Calculates

1. **Calculate Required Income:**
   - Sums all monthly expenses
   - Multiplies by 0.8 (80% rule)
   - Formula: `requiredMonthlyIncome = totalMonthlyExpenses × 0.8`

2. **Apply 4% Withdrawal Rule:**
   - Calculates 4% of total assets annually
   - Divides by 12 for monthly withdrawal
   - Formula: `monthlyWithdrawal = (totalAssets × 0.04) / 12`

3. **Add Other Income Sources:**
   - Social Security (self + spouse)
   - Pension
   - Rental income
   - Other income
   - Formula: `projectedMonthlyIncome = monthlyWithdrawal + allOtherIncome`

4. **Calculate Readiness Score:**
   - Compares projected income to required income
   - Formula: `readinessScore = min(100, (projectedMonthlyIncome / requiredMonthlyIncome) × 100)`

### Code Location
`src/services/retirementCalculations.ts` - `calculateIntermediateAnalysis()` function

### Example
- Total assets: $1,000,000
- 4% annual withdrawal: $1,000,000 × 0.04 = $40,000/year = $3,333/month
- Social Security: $1,500/month
- Total projected: $3,333 + $1,500 = $4,833/month
- Required: $4,000/month
- Readiness: ($4,833 / $4,000) × 100 = 121% (capped at 100%)

---

## Method 3: Advanced Analysis (Monte Carlo Simulation)

### What It Does
Runs 1,000 computer simulations testing different market scenarios to see how likely your retirement savings will last 30 years.

### How It Calculates (The 1,000 Simulations)

**No third-party libraries used** - implemented using pure JavaScript:

1. **Setup:**
   - Assumes 30 years in retirement
   - Base inflation rate: 3% (0.03)
   - Number of simulations: 1,000

2. **For Each Simulation (1,000 times):**
   ```javascript
   for (let i = 0; i < 1000; i++) {
     // Generate random return rate: 4% to 10% (average 7%)
     const returnRate = 0.07 + (Math.random() - 0.5) * 0.06;
     // Math.random() gives 0-1, so (Math.random() - 0.5) gives -0.5 to 0.5
     // Multiply by 0.06 gives -0.03 to +0.03
     // Add to 0.07 gives range: 0.04 to 0.10 (4% to 10%)
     
     // Generate random inflation: 2% to 4% (average 3%)
     const inflationVariation = 0.03 + (Math.random() - 0.5) * 0.02;
     
     // Start with current portfolio value
     let portfolioValue = totalAssets;
     let yearlyWithdrawal = requiredMonthlyIncome * 12;
     
     // Simulate 30 years
     for (let year = 0; year < 30; year++) {
       // Portfolio grows by return rate, then subtract withdrawal
       portfolioValue = portfolioValue * (1 + returnRate) - yearlyWithdrawal;
       
       // Withdrawal increases with inflation
       yearlyWithdrawal *= (1 + inflationVariation);
       
       // If portfolio goes negative, this scenario failed
       if (portfolioValue < 0) {
         success = false;
         break;
       }
     }
     
     // Count successful scenarios
     if (success) successfulScenarios++;
   }
   ```

3. **Calculate Results:**
   - Success rate = (successful scenarios / 1000) × 100
   - This becomes the `readinessScore` (e.g., 85% means 850 out of 1000 scenarios succeeded)
   - Average projected income = average of successful scenarios

### Technical Details

- **Random Number Generation:** Uses JavaScript's built-in `Math.random()` function
- **No External Libraries:** Pure JavaScript implementation
- **Performance:** Runs synchronously in the browser (typically completes in <100ms)
- **Randomness:** Each simulation uses different random values, simulating market volatility

### Code Location
`src/services/retirementCalculations.ts` - `calculateAdvancedAnalysis()` function (lines 97-178)

### Example Simulation Run

**Scenario 1:**
- Return rate: 8% (randomly generated)
- Inflation: 2.5% (randomly generated)
- Starting portfolio: $1,000,000
- Year 1: $1,000,000 × 1.08 - $48,000 = $1,032,000
- Year 2: $1,032,000 × 1.08 - $49,200 = $1,065,360
- ... continues for 30 years
- Result: Success (portfolio > $0)

**Scenario 2:**
- Return rate: 5% (randomly generated)
- Inflation: 3.5% (randomly generated)
- Starting portfolio: $1,000,000
- Year 1: $1,000,000 × 1.05 - $48,000 = $1,002,000
- Year 15: Portfolio goes negative
- Result: Failure

After 1,000 such scenarios, if 850 succeed, readiness score = 85%.

---

## Key Points for Explanation

### No Third-Party Integrations
- All calculations are **custom code** written in TypeScript
- Uses only JavaScript's built-in `Math` library
- No financial calculation libraries, no Monte Carlo libraries
- Runs entirely in the browser (client-side)

### Monte Carlo Implementation
- Uses a simple `for` loop to run 1,000 iterations
- Each iteration uses `Math.random()` to generate random market conditions
- Simulates 30 years of portfolio growth and withdrawals
- Counts how many scenarios succeed (portfolio doesn't go to zero)
- Success rate = readiness score

### Why This Approach?
- **Simple & Fast:** No external dependencies, runs instantly
- **Transparent:** You can see exactly how calculations work
- **Customizable:** Easy to adjust assumptions (return rates, inflation, years)
- **Client-Side:** All calculations happen in the browser, no server needed

### Limitations
- **Simplified Model:** Doesn't account for:
  - Tax implications
  - Sequence of returns risk (order matters)
  - Changing asset allocation over time
  - Healthcare cost spikes
  - Long-term care costs
- **Fixed Assumptions:** 
  - 30-year retirement period
  - Return rates between 4-10%
  - Inflation between 2-4%
- **No Historical Data:** Uses random distributions, not actual market history

### When to Use Each Method

- **Basic:** Quick estimate, simple to understand, good for initial planning
- **Intermediate:** Industry-standard 4% rule, includes all income sources, most commonly used
- **Advanced:** Most realistic, accounts for market volatility, best for detailed planning

---

## Code Structure

```
src/services/retirementCalculations.ts
├── calculateBasicAnalysis()      - Simple percentage-based calculation
├── calculateIntermediateAnalysis() - 4% withdrawal rule with income sources
└── calculateAdvancedAnalysis()    - Monte Carlo simulation (1000 iterations)
```

All functions:
- Take `RetirementData` as input
- Return `RetirementAnalysis` object
- Run synchronously (no async operations)
- Use pure mathematical calculations

