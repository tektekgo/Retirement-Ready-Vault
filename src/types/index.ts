export interface PersonalInfo {
  name?: string;
  age: number;
  spouseAge?: number;
  targetRetirementAge: number;
  riskTolerance: number;
}

export interface MonthlyExpenses {
  essential: {
    housing: number;
    utilities: number;
    food: number;
    healthcare: number;
    insurance: number;
    debtPayments: number;
  };
  discretionary: {
    entertainment: number;
    travel: number;
    dining: number;
    hobbies: number;
    other: number;
  };
}

export interface Assets {
  retirement401k: number;
  iraTraditional: number;
  iraRoth: number;
  brokerage: number;
  savings: number;
  realEstate: number;
  other: number;
}

export interface IncomeSources {
  currentSalary: number;
  spouseSalary?: number;
  socialSecuritySelf: { age: number; monthlyBenefit: number };
  socialSecuritySpouse?: { age: number; monthlyBenefit: number };
  pension?: number;
  rentalIncome?: number;
  otherIncome?: number;
}

export interface RetirementData {
  personalInfo: PersonalInfo;
  expenses: MonthlyExpenses;
  assets: Assets;
  incomeSources: IncomeSources;
  completedAt?: Date;
}

export interface RetirementAnalysis {
  method: 'basic' | 'intermediate' | 'advanced';
  readinessScore: number;
  projectedMonthlyIncome: number;
  requiredMonthlyIncome: number;
  gap: number;
  recommendations: string[];
  calculatedAt: Date;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
