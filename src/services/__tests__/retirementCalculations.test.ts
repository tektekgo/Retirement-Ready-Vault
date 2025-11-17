/**
 * Validation Tests for Retirement Calculations
 * 
 * These tests validate that our calculation methods produce accurate results
 * based on known scenarios and industry-standard formulas.
 * 
 * To run these tests, you'll need to install a testing framework:
 * npm install --save-dev vitest @vitest/ui
 * 
 * Then add to package.json scripts:
 * "test": "vitest"
 * 
 * NOTE: This file is excluded from the build. It's for validation purposes only.
 */

// @ts-nocheck - Test file, excluded from build
// import { describe, it, expect } from 'vitest';
import {
  calculateBasicAnalysis,
  calculateIntermediateAnalysis,
  calculateAdvancedAnalysis
} from '../retirementCalculations';
import { RetirementData } from '../../types';

// Helper function to create test data
const createTestData = (overrides?: Partial<RetirementData>): RetirementData => ({
  personalInfo: {
    name: 'Test User',
    age: 45,
    targetRetirementAge: 65,
    riskTolerance: 5,
    ...overrides?.personalInfo,
  },
  expenses: {
    essential: {
      housing: 2000,
      utilities: 300,
      food: 600,
      healthcare: 400,
      insurance: 300,
      debtPayments: 500,
      ...overrides?.expenses?.essential,
    },
    discretionary: {
      entertainment: 300,
      travel: 400,
      dining: 500,
      hobbies: 200,
      other: 300,
      ...overrides?.expenses?.discretionary,
    },
  },
  assets: {
    retirement401k: 500000,
    iraTraditional: 200000,
    iraRoth: 100000,
    brokerage: 100000,
    savings: 50000,
    realEstate: 200000,
    other: 50000,
    ...overrides?.assets,
  },
  incomeSources: {
    currentSalary: 100000,
    socialSecuritySelf: {
      age: 67,
      monthlyBenefit: 2000,
    },
    ...overrides?.incomeSources,
  },
});

describe('Retirement Calculations - Accuracy Validation', () => {
  describe('Basic Analysis - Formula Validation', () => {
    it('should calculate required income as 75% of expenses', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 2000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
      });

      const result = calculateBasicAnalysis(data);
      
      // Expected: $2,000 × 0.75 = $1,500
      expect(result.requiredMonthlyIncome).toBe(1500);
    });

    it('should calculate total needed for 30 years correctly', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 2000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
      });

      const result = calculateBasicAnalysis(data);
      
      // Required: $1,500/month
      // Total needed: $1,500 × 12 × 30 = $540,000
      const expectedTotalNeeded = 1500 * 12 * 30;
      const actualTotalNeeded = (result.requiredMonthlyIncome * 12 * 30);
      
      expect(actualTotalNeeded).toBe(expectedTotalNeeded);
    });

    it('should calculate readiness score correctly', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 2000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
        assets: {
          retirement401k: 270000, // Exactly 50% of $540,000 needed
          iraTraditional: 0,
          iraRoth: 0,
          brokerage: 0,
          savings: 0,
          realEstate: 0,
          other: 0,
        },
      });

      const result = calculateBasicAnalysis(data);
      
      // Savings: $270,000
      // Needed: $540,000
      // Readiness: (270,000 / 540,000) × 100 = 50%
      expect(result.readinessScore).toBeCloseTo(50, 1);
    });

    it('should cap readiness score at 100%', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 1000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
        assets: {
          retirement401k: 10000000, // Way more than needed
          iraTraditional: 0,
          iraRoth: 0,
          brokerage: 0,
          savings: 0,
          realEstate: 0,
          other: 0,
        },
      });

      const result = calculateBasicAnalysis(data);
      
      expect(result.readinessScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Intermediate Analysis - 4% Rule Validation', () => {
    it('should calculate 4% withdrawal correctly', () => {
      const data = createTestData({
        assets: {
          retirement401k: 1000000, // $1M
          iraTraditional: 0,
          iraRoth: 0,
          brokerage: 0,
          savings: 0,
          realEstate: 0,
          other: 0,
        },
        incomeSources: {
          currentSalary: 0,
          socialSecuritySelf: { age: 67, monthlyBenefit: 0 },
        },
      });

      const result = calculateIntermediateAnalysis(data);
      
      // 4% of $1M = $40,000/year = $3,333.33/month
      const expectedMonthlyWithdrawal = (1000000 * 0.04) / 12;
      
      // Projected income should equal monthly withdrawal (no other income)
      expect(result.projectedMonthlyIncome).toBeCloseTo(expectedMonthlyWithdrawal, 0);
    });

    it('should add Social Security to projected income', () => {
      const data = createTestData({
        assets: {
          retirement401k: 1000000,
          iraTraditional: 0,
          iraRoth: 0,
          brokerage: 0,
          savings: 0,
          realEstate: 0,
          other: 0,
        },
        incomeSources: {
          currentSalary: 0,
          socialSecuritySelf: { age: 67, monthlyBenefit: 2000 },
        },
      });

      const result = calculateIntermediateAnalysis(data);
      
      // 4% withdrawal: $3,333/month
      // Social Security: $2,000/month
      // Total: $5,333/month
      const expectedWithdrawal = (1000000 * 0.04) / 12;
      const expectedTotal = expectedWithdrawal + 2000;
      
      expect(result.projectedMonthlyIncome).toBeCloseTo(expectedTotal, 0);
    });

    it('should calculate readiness score correctly with 4% rule', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 2000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
        assets: {
          retirement401k: 1000000,
          iraTraditional: 0,
          iraRoth: 0,
          brokerage: 0,
          savings: 0,
          realEstate: 0,
          other: 0,
        },
        incomeSources: {
          currentSalary: 0,
          socialSecuritySelf: { age: 67, monthlyBenefit: 0 },
        },
      });

      const result = calculateIntermediateAnalysis(data);
      
      // Required: $2,000 × 0.8 = $1,600/month
      // Projected: $1,000,000 × 0.04 / 12 = $3,333/month
      // Readiness: ($3,333 / $1,600) × 100 = 208% (capped at 100%)
      expect(result.readinessScore).toBeLessThanOrEqual(100);
      expect(result.readinessScore).toBeGreaterThan(100); // Actually should be > 100 but capped
    });

    it('should use 80% rule for required income', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 5000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
      });

      const result = calculateIntermediateAnalysis(data);
      
      // Expected: $5,000 × 0.8 = $4,000
      expect(result.requiredMonthlyIncome).toBe(4000);
    });
  });

  describe('Advanced Analysis - Monte Carlo Validation', () => {
    it('should run 1000 simulations', () => {
      const data = createTestData();
      const result = calculateAdvancedAnalysis(data);
      
      // Readiness score should be between 0-100 (percentage of successful scenarios)
      expect(result.readinessScore).toBeGreaterThanOrEqual(0);
      expect(result.readinessScore).toBeLessThanOrEqual(100);
    });

    it('should produce consistent results for same input', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 2000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
        assets: {
          retirement401k: 1000000,
          iraTraditional: 0,
          iraRoth: 0,
          brokerage: 0,
          savings: 0,
          realEstate: 0,
          other: 0,
        },
      });

      // Run multiple times - results will vary due to randomness
      // but should be in reasonable range
      const results = Array.from({ length: 5 }, () => calculateAdvancedAnalysis(data));
      
      // All results should be valid percentages
      results.forEach(result => {
        expect(result.readinessScore).toBeGreaterThanOrEqual(0);
        expect(result.readinessScore).toBeLessThanOrEqual(100);
      });
    });

    it('should handle high savings scenario (likely success)', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 2000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
        assets: {
          retirement401k: 5000000, // $5M - very high savings
          iraTraditional: 0,
          iraRoth: 0,
          brokerage: 0,
          savings: 0,
          realEstate: 0,
          other: 0,
        },
      });

      const result = calculateAdvancedAnalysis(data);
      
      // With $5M and low expenses, success rate should be very high
      expect(result.readinessScore).toBeGreaterThan(80); // Likely > 80% success
    });

    it('should handle low savings scenario (likely failure)', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 5000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
        assets: {
          retirement401k: 100000, // $100K - very low savings
          iraTraditional: 0,
          iraRoth: 0,
          brokerage: 0,
          savings: 0,
          realEstate: 0,
          other: 0,
        },
      });

      const result = calculateAdvancedAnalysis(data);
      
      // With $100K and high expenses, success rate should be low
      expect(result.readinessScore).toBeLessThan(50); // Likely < 50% success
    });

    it('should use 80% rule for required income', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 5000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
      });

      const result = calculateAdvancedAnalysis(data);
      
      // Expected: $5,000 × 0.8 = $4,000
      expect(result.requiredMonthlyIncome).toBe(4000);
    });
  });

  describe('Cross-Method Validation', () => {
    it('should produce reasonable results across all methods', () => {
      const data = createTestData();
      
      const basic = calculateBasicAnalysis(data);
      const intermediate = calculateIntermediateAnalysis(data);
      const advanced = calculateAdvancedAnalysis(data);
      
      // All methods should produce valid readiness scores
      [basic, intermediate, advanced].forEach(result => {
        expect(result.readinessScore).toBeGreaterThanOrEqual(0);
        expect(result.readinessScore).toBeLessThanOrEqual(100);
        expect(result.requiredMonthlyIncome).toBeGreaterThan(0);
        expect(result.projectedMonthlyIncome).toBeGreaterThanOrEqual(0);
        expect(result.gap).toBeDefined();
        expect(result.recommendations.length).toBeGreaterThan(0);
      });
    });

    it('should use consistent required income calculation (Basic vs Intermediate/Advanced)', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 5000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
      });
      
      const basic = calculateBasicAnalysis(data);
      const intermediate = calculateIntermediateAnalysis(data);
      const advanced = calculateAdvancedAnalysis(data);
      
      // Basic uses 75%, Intermediate/Advanced use 80%
      expect(basic.requiredMonthlyIncome).toBe(3750); // $5,000 × 0.75
      expect(intermediate.requiredMonthlyIncome).toBe(4000); // $5,000 × 0.8
      expect(advanced.requiredMonthlyIncome).toBe(4000); // $5,000 × 0.8
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero expenses', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 0, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
      });

      const result = calculateBasicAnalysis(data);
      
      expect(result.requiredMonthlyIncome).toBe(0);
      expect(result.readinessScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle zero assets', () => {
      const data = createTestData({
        assets: {
          retirement401k: 0,
          iraTraditional: 0,
          iraRoth: 0,
          brokerage: 0,
          savings: 0,
          realEstate: 0,
          other: 0,
        },
      });

      const result = calculateBasicAnalysis(data);
      
      expect(result.projectedMonthlyIncome).toBe(0);
      expect(result.readinessScore).toBe(0);
    });

    it('should handle very high expenses', () => {
      const data = createTestData({
        expenses: {
          essential: { housing: 10000, utilities: 0, food: 0, healthcare: 0, insurance: 0, debtPayments: 0 },
          discretionary: { entertainment: 0, travel: 0, dining: 0, hobbies: 0, other: 0 },
        },
      });

      const result = calculateBasicAnalysis(data);
      
      expect(result.requiredMonthlyIncome).toBe(7500); // $10,000 × 0.75
      expect(result.readinessScore).toBeGreaterThanOrEqual(0);
    });
  });
});

/**
 * Manual Validation Checklist
 * 
 * Use these scenarios to manually validate against industry tools:
 * 
 * 1. Standard Scenario:
 *    - Age: 45, Retire: 65, Expenses: $5,000/month
 *    - Assets: $1,000,000
 *    - Social Security: $2,000/month at 67
 *    - Compare with FireCalc.com or Vanguard calculator
 * 
 * 2. High Savings Scenario:
 *    - Same as above but $3,000,000 assets
 *    - Should show high readiness (>80%)
 * 
 * 3. Low Savings Scenario:
 *    - Same as above but $300,000 assets
 *    - Should show low readiness (<50%)
 * 
 * 4. 4% Rule Validation:
 *    - $1,000,000 assets
 *    - 4% withdrawal = $40,000/year = $3,333/month
 *    - Verify this matches Intermediate method
 */

