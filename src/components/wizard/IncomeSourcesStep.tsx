import React from 'react';
import { IncomeSources } from '../../types';

interface IncomeSourcesStepProps {
  data: IncomeSources;
  onChange: (data: IncomeSources) => void;
  onNext: () => void;
  onBack: () => void;
}

export const IncomeSourcesStep: React.FC<IncomeSourcesStepProps> = ({ data, onChange, onNext, onBack }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (data.currentSalary < 0) {
      newErrors.currentSalary = 'Salary cannot be negative';
    }
    
    if (data.spouseSalary && data.spouseSalary < 0) {
      newErrors.spouseSalary = 'Spouse salary cannot be negative';
    }
    
    if (!data.socialSecuritySelf.age || data.socialSecuritySelf.age < 62 || data.socialSecuritySelf.age > 70) {
      newErrors.socialSecuritySelfAge = 'Social Security age must be between 62 and 70';
    }
    
    if (data.socialSecuritySelf.monthlyBenefit < 0) {
      newErrors.socialSecuritySelfBenefit = 'Benefit cannot be negative';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Income Sources</h2>
        <p className="text-gray-600">Tell us about your current and expected retirement income.</p>
      </div>

      <div className="bg-teal-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Income</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Your Annual Salary *
            </label>
            <input
              type="number"
              id="currentSalary"
              value={data.currentSalary || ''}
              onChange={(e) => onChange({ ...data, currentSalary: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
            {errors.currentSalary && <p className="mt-1 text-sm text-red-600">{errors.currentSalary}</p>}
          </div>
          <div>
            <label htmlFor="spouseSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Spouse Annual Salary (Optional)
            </label>
            <input
              type="number"
              id="spouseSalary"
              value={data.spouseSalary || ''}
              onChange={(e) => onChange({ ...data, spouseSalary: parseFloat(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
            {errors.spouseSalary && <p className="mt-1 text-sm text-red-600">{errors.spouseSalary}</p>}
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Security (Self)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ssAge" className="block text-sm font-medium text-gray-700 mb-1">
              Claiming Age (62-70) *
            </label>
            <input
              type="number"
              id="ssAge"
              value={data.socialSecuritySelf.age || ''}
              onChange={(e) => onChange({ 
                ...data, 
                socialSecuritySelf: { ...data.socialSecuritySelf, age: parseInt(e.target.value) || 0 }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="67"
            />
            {errors.socialSecuritySelfAge && <p className="mt-1 text-sm text-red-600">{errors.socialSecuritySelfAge}</p>}
          </div>
          <div>
            <label htmlFor="ssBenefit" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Monthly Benefit *
            </label>
            <input
              type="number"
              id="ssBenefit"
              value={data.socialSecuritySelf.monthlyBenefit || ''}
              onChange={(e) => onChange({ 
                ...data, 
                socialSecuritySelf: { ...data.socialSecuritySelf, monthlyBenefit: parseFloat(e.target.value) || 0 }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
            {errors.socialSecuritySelfBenefit && <p className="mt-1 text-sm text-red-600">{errors.socialSecuritySelfBenefit}</p>}
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Security (Spouse) - Optional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ssSpouseAge" className="block text-sm font-medium text-gray-700 mb-1">
              Claiming Age (62-70)
            </label>
            <input
              type="number"
              id="ssSpouseAge"
              value={data.socialSecuritySpouse?.age || ''}
              onChange={(e) => onChange({ 
                ...data, 
                socialSecuritySpouse: { 
                  age: parseInt(e.target.value) || 0,
                  monthlyBenefit: data.socialSecuritySpouse?.monthlyBenefit || 0
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="67"
            />
          </div>
          <div>
            <label htmlFor="ssSpouseBenefit" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Monthly Benefit
            </label>
            <input
              type="number"
              id="ssSpouseBenefit"
              value={data.socialSecuritySpouse?.monthlyBenefit || ''}
              onChange={(e) => onChange({ 
                ...data, 
                socialSecuritySpouse: { 
                  age: data.socialSecuritySpouse?.age || 67,
                  monthlyBenefit: parseFloat(e.target.value) || 0
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Income Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pension" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Pension
            </label>
            <input
              type="number"
              id="pension"
              value={data.pension || ''}
              onChange={(e) => onChange({ ...data, pension: parseFloat(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="rentalIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Rental Income
            </label>
            <input
              type="number"
              id="rentalIncome"
              value={data.rentalIncome || ''}
              onChange={(e) => onChange({ ...data, rentalIncome: parseFloat(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="otherIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Other Monthly Income
            </label>
            <input
              type="number"
              id="otherIncome"
              value={data.otherIncome || ''}
              onChange={(e) => onChange({ ...data, otherIncome: parseFloat(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
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
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </form>
  );
};
