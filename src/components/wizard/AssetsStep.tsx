import React from 'react';
import { Assets } from '../../types';

interface AssetsStepProps {
  data: Assets;
  onChange: (data: Assets) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AssetsStep: React.FC<AssetsStepProps> = ({ data, onChange, onNext, onBack }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    const values = Object.values(data);
    if (values.some(v => v < 0)) {
      newErrors.assets = 'Asset values cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const totalAssets = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Assets</h2>
        <p className="text-gray-600">Tell us about your current savings and investments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="retirement401k" className="block text-sm font-medium text-gray-700 mb-1">
            401(k) Balance
          </label>
          <input
            type="number"
            id="retirement401k"
            value={data.retirement401k || ''}
            onChange={(e) => onChange({ ...data, retirement401k: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="iraTraditional" className="block text-sm font-medium text-gray-700 mb-1">
            Traditional IRA
          </label>
          <input
            type="number"
            id="iraTraditional"
            value={data.iraTraditional || ''}
            onChange={(e) => onChange({ ...data, iraTraditional: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="iraRoth" className="block text-sm font-medium text-gray-700 mb-1">
            Roth IRA
          </label>
          <input
            type="number"
            id="iraRoth"
            value={data.iraRoth || ''}
            onChange={(e) => onChange({ ...data, iraRoth: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="brokerage" className="block text-sm font-medium text-gray-700 mb-1">
            Brokerage Accounts
          </label>
          <input
            type="number"
            id="brokerage"
            value={data.brokerage || ''}
            onChange={(e) => onChange({ ...data, brokerage: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="savings" className="block text-sm font-medium text-gray-700 mb-1">
            Savings Accounts
          </label>
          <input
            type="number"
            id="savings"
            value={data.savings || ''}
            onChange={(e) => onChange({ ...data, savings: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="realEstate" className="block text-sm font-medium text-gray-700 mb-1">
            Real Estate (Equity)
          </label>
          <input
            type="number"
            id="realEstate"
            value={data.realEstate || ''}
            onChange={(e) => onChange({ ...data, realEstate: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="other" className="block text-sm font-medium text-gray-700 mb-1">
            Other Assets
          </label>
          <input
            type="number"
            id="other"
            value={data.other || ''}
            onChange={(e) => onChange({ ...data, other: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>

      {errors.assets && <p className="text-sm text-red-600">{errors.assets}</p>}

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900">Total Assets: ${totalAssets.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </form>
  );
};
