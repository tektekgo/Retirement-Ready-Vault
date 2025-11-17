/**
 * Utility functions for managing user data
 * Provides easy ways to clear data and understand what's stored
 */

import { retirementDataService } from '../services/retirementData.service';

export interface ClearDataOptions {
  clearLocalStorage?: boolean;
  clearDatabase?: boolean;
  userId?: string;
}

/**
 * Clear all retirement planning data for a user
 */
export const clearAllUserData = async (options: ClearDataOptions = {}): Promise<void> => {
  const {
    clearLocalStorage = true,
    clearDatabase = true,
    userId,
  } = options;

  try {
    // Clear database if user is logged in
    if (clearDatabase && userId) {
      try {
        await retirementDataService.deleteUserData(userId);
      } catch (error) {
        console.warn('Error deleting database data:', error);
        // Continue even if database deletion fails
      }
    }

    // Clear localStorage
    if (clearLocalStorage) {
      if (userId) {
        // Clear user-specific key
        const localDataKey = `retirementWizardData_${userId}`;
        localStorage.removeItem(localDataKey);
      }
      
      // Clear old non-user-specific key (for migration)
      localStorage.removeItem('retirementWizardData');
      
      // Clear any other retirement-related keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('retirementWizardData')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

/**
 * Get information about what data is stored
 */
export const getDataStorageInfo = (userId?: string): {
  hasLocalData: boolean;
  hasDatabaseData: boolean;
  dataLocation: string[];
} => {
  const info = {
    hasLocalData: false,
    hasDatabaseData: false,
    dataLocation: [] as string[],
  };

  // Check localStorage
  if (userId) {
    const localDataKey = `retirementWizardData_${userId}`;
    if (localStorage.getItem(localDataKey)) {
      info.hasLocalData = true;
      info.dataLocation.push('Your Browser (Local Storage)');
    }
  }

  // Note: Database check would require async call, so we'll indicate it might exist if user is logged in
  if (userId) {
    info.dataLocation.push('Secure Database (if logged in)');
    info.hasDatabaseData = true; // Assumed if user is logged in
  }

  return info;
};

