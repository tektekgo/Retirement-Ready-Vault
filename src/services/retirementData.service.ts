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

    // Use upsert instead of insert to handle case where record already exists
    const { data, error } = await supabase
      .from('retirement_data')
      .upsert(emptyData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async loadUserData(userId: string): Promise<RetirementData | null> {
    // Check if Supabase is configured by checking if supabase URL is valid
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const isConfigured = supabaseUrl && 
                         supabaseUrl !== 'your-supabase-project-url' && 
                         supabaseUrl.startsWith('http');

    if (!isConfigured) {
      // If Supabase not configured, check user-specific localStorage
      const localDataKey = `retirementWizardData_${userId}`;
      const localData = localStorage.getItem(localDataKey);
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          // Only return if it belongs to this user
          if (parsedData?.data && parsedData.userId === userId) {
            return parsedData.data;
          }
        } catch (e) {
          console.error('Failed to parse local data', e);
        }
      }
      return null;
    }

    try {
      // Use maybeSingle() instead of single() to handle cases where no record exists
      const { data, error } = await supabase
        .from('retirement_data')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        // Handle different error codes
        if (error.code === 'PGRST116') {
          // No rows returned - this is normal for new users
          return null;
        }
        // Check for 406 Not Acceptable errors
        const errorStatus = (error as any)?.status || (error as any)?.statusCode;
        if (errorStatus === 406 || error.code === 'PGRST301') {
          // 406 Not Acceptable - usually means RLS policy issue or table doesn't exist
          console.warn('406 error loading retirement data - possible RLS policy issue. Check your Supabase RLS policies for the retirement_data table.');
          console.warn('Error details:', error);
          return null;
        }
        console.error('Error loading user data:', error);
        // Return null instead of throwing to prevent hanging
        return null;
      }

      // If no data, return null (normal for new users)
      if (!data) {
        return null;
      }

      return this.convertToRetirementData(data);
    } catch (error: any) {
      console.error('Error loading user data:', error);
      // Handle 406 errors gracefully
      if (error?.status === 406 || error?.statusCode === 406 || error?.code === 'PGRST301') {
        console.warn('406 Not Acceptable error - this usually indicates an RLS policy issue. Check your Supabase table permissions.');
        return null;
      }
      // Return null instead of throwing to prevent hanging
      return null;
    }
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
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const isConfigured = supabaseUrl && 
                         supabaseUrl !== 'your-supabase-project-url' && 
                         supabaseUrl.startsWith('http');

    if (!isConfigured) {
      // If Supabase not configured, just save to user-specific localStorage
      console.log('Supabase not configured - saving to localStorage only');
      const localDataKey = `retirementWizardData_${userId}`;
      localStorage.setItem(localDataKey, JSON.stringify({ 
        data, 
        step: 4,
        completed: true,
        userId 
      }));
      return;
    }

    const record = {
      user_id: userId,
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

    try {
      // Use upsert with onConflict to handle existing records
      const { error } = await supabase
        .from('retirement_data')
        .upsert(record, { onConflict: 'user_id' })
        .select();

      if (error) {
        console.error('Supabase save error:', error);
        throw error;
      }

      // Also save to user-specific localStorage as backup
      const localDataKey = `retirementWizardData_${userId}`;
      localStorage.setItem(localDataKey, JSON.stringify({ 
        data, 
        step: 4,
        completed: true,
        userId 
      }));
    } catch (error) {
      // Save to user-specific localStorage as fallback
      console.warn('Failed to save to Supabase, saving to localStorage:', error);
      const localDataKey = `retirementWizardData_${userId}`;
      localStorage.setItem(localDataKey, JSON.stringify({ 
        data, 
        step: 4,
        completed: true,
        userId 
      }));
      throw error;
    }
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

    // Clear old non-user-specific key after migration
    localStorage.removeItem('retirementWizardData');
    // Also clear user-specific key if it exists (will be recreated by saveAllData)
    const localDataKey = `retirementWizardData_${userId}`;
    localStorage.removeItem(localDataKey);
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
      name: '',
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
