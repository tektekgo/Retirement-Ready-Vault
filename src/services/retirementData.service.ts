import { supabase } from './supabase';
import { RetirementData } from '../types';

export interface RetirementDataRecord {
  id: string;
  user_id: string;
  personal_info: any;
  monthly_expenses: any;
  assets: any;
  income_sources: any;
  analysis_results: any;
  wizard_completion_status: any;
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
    step: string,
    stepData: Partial<RetirementData>
  ): Promise<void> {
    const existingData = await this.loadUserData(userId);

    if (!existingData) {
      await this.initializeUserData(userId);
    }

    const updates: any = {};

    if (stepData.personalInfo) {
      updates.personal_info = stepData.personalInfo;
      updates.wizard_completion_status = {
        ...(existingData?.personalInfo ? { step1: true } : {}),
        step1: true,
      };
    }

    if (stepData.expenses) {
      updates.monthly_expenses = stepData.expenses;
      updates.wizard_completion_status = {
        ...(existingData?.expenses ? { step2: true } : {}),
        step2: true,
      };
    }

    if (stepData.assets) {
      updates.assets = stepData.assets;
      updates.wizard_completion_status = {
        ...(existingData?.assets ? { step3: true } : {}),
        step3: true,
      };
    }

    if (stepData.incomeSources) {
      updates.income_sources = stepData.incomeSources;
      updates.wizard_completion_status = {
        ...(existingData?.incomeSources ? { step4: true } : {}),
        step4: true,
      };
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

  async saveAnalysisResults(userId: string, analysisResults: any): Promise<void> {
    const { error } = await supabase
      .from('retirement_data')
      .update({ analysis_results: analysisResults })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async migrateFromLocalStorage(userId: string, localData: any): Promise<void> {
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
    return {
      personalInfo: record.personal_info || {
        age: 0,
        targetRetirementAge: 0,
        riskTolerance: 5,
      },
      expenses: record.monthly_expenses || {
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
      },
      assets: record.assets || {
        retirement401k: 0,
        iraTraditional: 0,
        iraRoth: 0,
        brokerage: 0,
        savings: 0,
        realEstate: 0,
        other: 0,
      },
      incomeSources: record.income_sources || {
        currentSalary: 0,
        socialSecuritySelf: { age: 67, monthlyBenefit: 0 },
      },
    };
  }
}

export const retirementDataService = new RetirementDataService();
