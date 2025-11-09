import { supabase } from './supabase';
import { RetirementData, PersonalInfo, MonthlyExpenses, Assets, IncomeSources, RetirementAnalysis } from '../types';

export interface WizardCompletionStatus {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
}

export interface RetirementDataRecord {
  id: string;
  user_id: string;
  personal_info: Partial<PersonalInfo>;
  monthly_expenses: Partial<MonthlyExpenses>;
  assets: Partial<Assets>;
  income_sources: Partial<IncomeSources>;
  analysis_results: Partial<RetirementAnalysis> | null;
  wizard_completion_status: WizardCompletionStatus;
  created_at: string;
  updated_at: string;
}

export class RetirementDataService {
  async initializeUserData(userId: string): Promise<RetirementDataRecord> {
    const emptyData = {
      user_id: userId,
      personal_info: {},
      monthly_expenses: {},
      assets: {},
      income_sources: {},
      analysis_results: {},
      wizard_completion_status: {
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
      },
    };

    const { data, error } = await supabase
      .from('retirement_data')
      .insert(emptyData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async loadUserData(userId: string): Promise<RetirementData | null> {
    const { data, error } = await supabase
      .from('retirement_data')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return this.convertToRetirementData(data);
  }

  async saveWizardStep(
    userId: string,
    _step: string,
    stepData: Partial<RetirementData>
  ): Promise<void> {
    const existingData = await this.loadUserData(userId);

    if (!existingData) {
      await this.initializeUserData(userId);
    }

    const updates: Partial<RetirementDataRecord> = {};

    if (stepData.personalInfo) {
      updates.personal_info = stepData.personalInfo;
    }

    if (stepData.expenses) {
      updates.monthly_expenses = stepData.expenses;
    }

    if (stepData.assets) {
      updates.assets = stepData.assets;
    }

    if (stepData.incomeSources) {
      updates.income_sources = stepData.incomeSources;
    }

    const { error } = await supabase
      .from('retirement_data')
      .update(updates)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async saveAllData(userId: string, data: RetirementData): Promise<void> {
    const record = {
      personal_info: data.personalInfo,
      monthly_expenses: data.expenses,
      assets: data.assets,
      income_sources: data.incomeSources,
      wizard_completion_status: {
        step1: true,
        step2: true,
        step3: true,
        step4: true,
        step5: true,
      },
    };

    const { error } = await supabase
      .from('retirement_data')
      .upsert({ user_id: userId, ...record })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async saveAnalysisResults(userId: string, analysisResults: Partial<RetirementAnalysis>): Promise<void> {
    const { error } = await supabase
      .from('retirement_data')
      .update({ analysis_results: analysisResults })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async migrateFromLocalStorage(userId: string, localData: { data?: RetirementData }): Promise<void> {
    if (!localData || !localData.data) {
      return;
    }

    const retirementData: RetirementData = localData.data;

    await this.saveAllData(userId, retirementData);

    localStorage.removeItem('retirementWizardData');
  }

  async deleteUserData(userId: string): Promise<void> {
    const { error } = await supabase
      .from('retirement_data')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  private convertToRetirementData(record: RetirementDataRecord): RetirementData {
    const defaultPersonalInfo: PersonalInfo = {
      age: 0,
      targetRetirementAge: 0,
      riskTolerance: 5,
    };

    const defaultExpenses: MonthlyExpenses = {
      essential: {
        housing: 0,
        utilities: 0,
        food: 0,
        healthcare: 0,
        insurance: 0,
        debtPayments: 0,
      },
      discretionary: {
        entertainment: 0,
        travel: 0,
        dining: 0,
        hobbies: 0,
        other: 0,
      },
    };

    const defaultAssets: Assets = {
      retirement401k: 0,
      iraTraditional: 0,
      iraRoth: 0,
      brokerage: 0,
      savings: 0,
      realEstate: 0,
      other: 0,
    };

    const defaultIncomeSources: IncomeSources = {
      currentSalary: 0,
      socialSecuritySelf: { age: 67, monthlyBenefit: 0 },
    };

    return {
      personalInfo: { ...defaultPersonalInfo, ...record.personal_info },
      expenses: { 
        essential: { ...defaultExpenses.essential, ...record.monthly_expenses?.essential },
        discretionary: { ...defaultExpenses.discretionary, ...record.monthly_expenses?.discretionary },
      },
      assets: { ...defaultAssets, ...record.assets },
      incomeSources: { ...defaultIncomeSources, ...record.income_sources },
    };
  }
}

export const retirementDataService = new RetirementDataService();
