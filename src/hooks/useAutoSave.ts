import { useEffect, useRef, useState } from 'react';
import { retirementDataService } from '../services/retirementData.service';
import { RetirementData } from '../types';

interface UseAutoSaveOptions {
  userId: string;
  data: Partial<RetirementData>;
  debounceMs?: number;
  enabled?: boolean;
}

interface AutoSaveStatus {
  saving: boolean;
  saved: boolean;
  error: string | null;
  lastSaved: Date | null;
}

export const useAutoSave = ({
  userId,
  data,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions): AutoSaveStatus => {
  const [status, setStatus] = useState<AutoSaveStatus>({
    saving: false,
    saved: false,
    error: null,
    lastSaved: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    const currentDataString = JSON.stringify(data);

    if (currentDataString === previousDataRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setStatus((prev) => ({ ...prev, saving: false, saved: false }));

    timeoutRef.current = setTimeout(async () => {
      setStatus((prev) => ({ ...prev, saving: true, error: null }));

      try {
        const step = determineStep(data);
        await retirementDataService.saveWizardStep(userId, step, data);

        setStatus({
          saving: false,
          saved: true,
          error: null,
          lastSaved: new Date(),
        });

        previousDataRef.current = currentDataString;

        setTimeout(() => {
          setStatus((prev) => ({ ...prev, saved: false }));
        }, 3000);
      } catch (err) {
        const error = err as Error;
        setStatus({
          saving: false,
          saved: false,
          error: error.message || 'Failed to save',
          lastSaved: null,
        });
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [userId, data, debounceMs, enabled]);

  return status;
};

function determineStep(data: Partial<RetirementData>): string {
  if (data.personalInfo) return 'step1';
  if (data.expenses) return 'step2';
  if (data.assets) return 'step3';
  if (data.incomeSources) return 'step4';
  return 'step5';
}
