import { RetirementData, RetirementAnalysis } from '../types';

/**
 * Basic Analysis: 70-80% Rule
 * 
 * Simple rule-of-thumb calculation:
 * - Assumes you need 75% of current expenses in retirement
 * - Divides savings evenly over 30 years
 * - Compares what you have vs. what you need
 */
export const calculateBasicAnalysis = (data: RetirementData): RetirementAnalysis => {
  const { expenses, assets } = data;
  
  const totalEssential = Object.values(expenses.essential).reduce((a, b) => a + b, 0);
  const totalDiscretionary = Object.values(expenses.discretionary).reduce((a, b) => a + b, 0);
  const totalMonthlyExpenses = totalEssential + totalDiscretionary;
  
  // 75% rule: assumes you'll spend 75% of current expenses in retirement
  const requiredMonthlyIncome = totalMonthlyExpenses * 0.75;
  
  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  const yearsInRetirement = 30;
  
  // Calculate total amount needed for 30 years
  const totalNeeded = requiredMonthlyIncome * 12 * yearsInRetirement;
  const currentSavings = totalAssets;
  
  // Readiness score: percentage of needed amount you currently have
  const readinessScore = Math.min(100, (currentSavings / totalNeeded) * 100);
  
  const recommendations: string[] = [];
  if (readinessScore < 50) {
    recommendations.push('Consider increasing retirement contributions significantly');
    recommendations.push('Review and reduce discretionary expenses');
    recommendations.push('Explore additional income sources');
  } else if (readinessScore < 75) {
    recommendations.push('You are on track but could benefit from increased savings');
    recommendations.push('Consider maximizing 401(k) contributions');
  } else {
    recommendations.push('You are well-positioned for retirement');
    recommendations.push('Consider diversifying your investment portfolio');
  }
  
  return {
    method: 'basic',
    readinessScore,
    projectedMonthlyIncome: (currentSavings / yearsInRetirement) / 12,
    requiredMonthlyIncome,
    gap: requiredMonthlyIncome - ((currentSavings / yearsInRetirement) / 12),
    recommendations,
    calculatedAt: new Date(),
  };
};

/**
 * Intermediate Analysis: 4% Safe Withdrawal Rule
 * 
 * Uses the proven "4% rule" from retirement research:
 * - You can safely withdraw 4% of your portfolio annually
 * - Includes all income sources (Social Security, pension, etc.)
 * - More realistic than basic method
 */
export const calculateIntermediateAnalysis = (data: RetirementData): RetirementAnalysis => {
  const { expenses, assets, incomeSources } = data;
  
  const totalEssential = Object.values(expenses.essential).reduce((a, b) => a + b, 0);
  const totalDiscretionary = Object.values(expenses.discretionary).reduce((a, b) => a + b, 0);
  const totalMonthlyExpenses = totalEssential + totalDiscretionary;
  
  // 80% rule: assumes you'll spend 80% of current expenses in retirement
  const requiredMonthlyIncome = totalMonthlyExpenses * 0.8;
  
  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  // 4% Safe Withdrawal Rate: proven rule that 4% annual withdrawal is sustainable
  const withdrawalRate = 0.04;
  
  // Calculate annual and monthly withdrawal from portfolio
  const annualWithdrawal = totalAssets * withdrawalRate;
  const monthlyWithdrawal = annualWithdrawal / 12;
  
  const socialSecurityMonthly = incomeSources.socialSecuritySelf.monthlyBenefit + 
    (incomeSources.socialSecuritySpouse?.monthlyBenefit || 0);
  const pensionMonthly = incomeSources.pension || 0;
  const rentalMonthly = incomeSources.rentalIncome || 0;
  const otherMonthly = incomeSources.otherIncome || 0;
  
  const projectedMonthlyIncome = monthlyWithdrawal + socialSecurityMonthly + 
    pensionMonthly + rentalMonthly + otherMonthly;
  
  const gap = requiredMonthlyIncome - projectedMonthlyIncome;
  const readinessScore = Math.min(100, (projectedMonthlyIncome / requiredMonthlyIncome) * 100);
  
  const recommendations: string[] = [];
  if (readinessScore < 60) {
    recommendations.push('Significant savings gap detected - consider delaying retirement');
    recommendations.push('Increase annual contributions by at least 20%');
    recommendations.push('Review investment allocation for better returns');
  } else if (readinessScore < 85) {
    recommendations.push('Close to target - maintain current savings rate');
    recommendations.push('Consider part-time work in early retirement');
    recommendations.push('Optimize Social Security claiming strategy');
  } else {
    recommendations.push('Excellent retirement readiness');
    recommendations.push('Consider tax-efficient withdrawal strategies');
    recommendations.push('Review estate planning options');
  }
  
  return {
    method: 'intermediate',
    readinessScore,
    projectedMonthlyIncome,
    requiredMonthlyIncome,
    gap,
    recommendations,
    calculatedAt: new Date(),
  };
};

/**
 * Advanced Analysis: Monte Carlo Simulation
 * 
 * This method runs 1,000 simulations to test retirement readiness under various market conditions.
 * 
 * HOW IT WORKS:
 * 1. For each of 1,000 simulations:
 *    - Generates a random investment return rate (4% to 10%, average 7%)
 *    - Generates a random inflation rate (2% to 4%, average 3%)
 *    - Simulates 30 years of portfolio growth and withdrawals
 *    - Checks if portfolio survives (doesn't go negative)
 * 
 * 2. Calculates success rate: (successful scenarios / 1000) × 100
 * 
 * 3. Uses JavaScript's built-in Math.random() - NO third-party libraries needed
 * 
 * TECHNICAL DETAILS:
 * - Runs synchronously in the browser (typically <100ms)
 * - Uses pure JavaScript - no external Monte Carlo libraries
 * - Each simulation is independent and uses different random values
 * - Simulates market volatility by varying returns and inflation
 */
export const calculateAdvancedAnalysis = (data: RetirementData): RetirementAnalysis => {
  const { expenses, assets, incomeSources } = data;
  
  const totalEssential = Object.values(expenses.essential).reduce((a, b) => a + b, 0);
  const totalDiscretionary = Object.values(expenses.discretionary).reduce((a, b) => a + b, 0);
  const totalMonthlyExpenses = totalEssential + totalDiscretionary;
  
  const requiredMonthlyIncome = totalMonthlyExpenses * 0.8;
  
  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  const yearsInRetirement = 30;
  const inflationRate = 0.03; // Base inflation rate: 3%
  const iterations = 1000; // Number of Monte Carlo simulations
  
  let successfulScenarios = 0;
  let totalProjectedIncome = 0;
  
  // MONTE CARLO SIMULATION: Run 1,000 iterations
  // Each iteration tests a different market scenario
  for (let i = 0; i < iterations; i++) {
    // Generate random return rate: 4% to 10% (centered around 7%)
    // Math.random() returns 0-1, so (Math.random() - 0.5) gives -0.5 to 0.5
    // Multiply by 0.06 gives -0.03 to +0.03, add to 0.07 = 0.04 to 0.10
    const returnRate = 0.07 + (Math.random() - 0.5) * 0.06;
    
    // Generate random inflation: 2% to 4% (centered around 3%)
    const inflationVariation = inflationRate + (Math.random() - 0.5) * 0.02;
    
    // Start simulation with current portfolio value
    let portfolioValue = totalAssets;
    let yearlyWithdrawal = requiredMonthlyIncome * 12;
    
    let success = true;
    // Simulate 30 years of retirement
    for (let year = 0; year < yearsInRetirement; year++) {
      // Portfolio grows by return rate, then subtract annual withdrawal
      portfolioValue = portfolioValue * (1 + returnRate) - yearlyWithdrawal;
      // Withdrawal increases each year due to inflation
      yearlyWithdrawal *= (1 + inflationVariation);
      
      // If portfolio goes negative, this scenario failed
      if (portfolioValue < 0) {
        success = false;
        break;
      }
    }
    
    // Count successful scenarios and accumulate projected income
    if (success) {
      successfulScenarios++;
      // Calculate average monthly income from remaining portfolio
      totalProjectedIncome += portfolioValue / yearsInRetirement / 12;
    }
  }
  
  // Calculate success rate as percentage (this becomes readiness score)
  const successRate = (successfulScenarios / iterations) * 100;
  // Average projected income across all simulations
  const avgProjectedMonthlyIncome = totalProjectedIncome / iterations;
  
  const socialSecurityMonthly = incomeSources.socialSecuritySelf.monthlyBenefit + 
    (incomeSources.socialSecuritySpouse?.monthlyBenefit || 0);
  const pensionMonthly = incomeSources.pension || 0;
  const rentalMonthly = incomeSources.rentalIncome || 0;
  const otherMonthly = incomeSources.otherIncome || 0;
  
  const projectedMonthlyIncome = avgProjectedMonthlyIncome + socialSecurityMonthly + 
    pensionMonthly + rentalMonthly + otherMonthly;
  
  const gap = requiredMonthlyIncome - projectedMonthlyIncome;
  const readinessScore = successRate;
  
  const recommendations: string[] = [];
  if (successRate < 70) {
    recommendations.push('Monte Carlo analysis shows high risk of portfolio depletion');
    recommendations.push('Consider reducing expenses or increasing savings significantly');
    recommendations.push('Explore guaranteed income sources (annuities, pensions)');
    recommendations.push('Consider delaying retirement by 3-5 years');
  } else if (successRate < 85) {
    recommendations.push('Moderate success probability - some adjustments recommended');
    recommendations.push('Build larger emergency fund for market downturns');
    recommendations.push('Consider more conservative asset allocation');
  } else {
    recommendations.push('Excellent probability of retirement success');
    recommendations.push('Portfolio should sustain through various market conditions');
    recommendations.push('Consider legacy planning and charitable giving');
  }
  
  return {
    method: 'advanced',
    readinessScore,
    projectedMonthlyIncome,
    requiredMonthlyIncome,
    gap,
    recommendations,
    calculatedAt: new Date(),
  };
};
