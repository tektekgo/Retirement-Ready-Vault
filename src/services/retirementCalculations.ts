import { RetirementData, RetirementAnalysis } from '../types';

export const calculateBasicAnalysis = (data: RetirementData): RetirementAnalysis => {
  const { expenses, assets } = data;
  
  const totalEssential = Object.values(expenses.essential).reduce((a, b) => a + b, 0);
  const totalDiscretionary = Object.values(expenses.discretionary).reduce((a, b) => a + b, 0);
  const totalMonthlyExpenses = totalEssential + totalDiscretionary;
  
  const requiredMonthlyIncome = totalMonthlyExpenses * 0.75;
  
  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  const yearsInRetirement = 30;
  
  const totalNeeded = requiredMonthlyIncome * 12 * yearsInRetirement;
  const currentSavings = totalAssets;
  
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

export const calculateIntermediateAnalysis = (data: RetirementData): RetirementAnalysis => {
  const { expenses, assets, incomeSources } = data;
  
  const totalEssential = Object.values(expenses.essential).reduce((a, b) => a + b, 0);
  const totalDiscretionary = Object.values(expenses.discretionary).reduce((a, b) => a + b, 0);
  const totalMonthlyExpenses = totalEssential + totalDiscretionary;
  
  const requiredMonthlyIncome = totalMonthlyExpenses * 0.8;
  
  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  const withdrawalRate = 0.04;
  
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

export const calculateAdvancedAnalysis = (data: RetirementData): RetirementAnalysis => {
  const { expenses, assets, incomeSources } = data;
  
  const totalEssential = Object.values(expenses.essential).reduce((a, b) => a + b, 0);
  const totalDiscretionary = Object.values(expenses.discretionary).reduce((a, b) => a + b, 0);
  const totalMonthlyExpenses = totalEssential + totalDiscretionary;
  
  const requiredMonthlyIncome = totalMonthlyExpenses * 0.8;
  
  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  const yearsInRetirement = 30;
  const inflationRate = 0.03;
  const iterations = 1000;
  
  let successfulScenarios = 0;
  let totalProjectedIncome = 0;
  
  for (let i = 0; i < iterations; i++) {
    const returnRate = 0.07 + (Math.random() - 0.5) * 0.06;
    const inflationVariation = inflationRate + (Math.random() - 0.5) * 0.02;
    
    let portfolioValue = totalAssets;
    let yearlyWithdrawal = requiredMonthlyIncome * 12;
    
    let success = true;
    for (let year = 0; year < yearsInRetirement; year++) {
      portfolioValue = portfolioValue * (1 + returnRate) - yearlyWithdrawal;
      yearlyWithdrawal *= (1 + inflationVariation);
      
      if (portfolioValue < 0) {
        success = false;
        break;
      }
    }
    
    if (success) {
      successfulScenarios++;
      totalProjectedIncome += portfolioValue / yearsInRetirement / 12;
    }
  }
  
  const successRate = (successfulScenarios / iterations) * 100;
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
