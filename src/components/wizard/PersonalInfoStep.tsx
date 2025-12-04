import React from 'react';
import { PersonalInfo } from '../../types';

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  onNext: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange, onNext }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.age || data.age < 18 || data.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    
    if (data.spouseAge && (data.spouseAge < 18 || data.spouseAge > 100)) {
      newErrors.spouseAge = 'Spouse age must be between 18 and 100';
    }
    
    if (!data.targetRetirementAge || data.targetRetirementAge <= data.age) {
      newErrors.targetRetirementAge = 'Target retirement age must be greater than current age';
    }
    
    if (!data.riskTolerance || data.riskTolerance < 1 || data.riskTolerance > 10) {
      newErrors.riskTolerance = 'Risk tolerance must be between 1 and 10';
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with some basic information about you and your retirement goals.</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name (Optional)
        </label>
        <input
          id="name"
          type="text"
          value={data.name || ''}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border border-charcoal-300 rounded-input focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-250"
        />
        <p className="mt-1 text-xs text-gray-500">This will appear on your retirement report</p>
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Current Age *
        </label>
        <input
          type="number"
          id="age"
          value={data.age || ''}
          onChange={(e) => onChange({ ...data, age: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Enter your age"
        />
        {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
      </div>

      <div>
        <label htmlFor="spouseAge" className="block text-sm font-medium text-gray-700 mb-1">
          Spouse Age (Optional)
        </label>
        <input
          type="number"
          id="spouseAge"
          value={data.spouseAge || ''}
          onChange={(e) => onChange({ ...data, spouseAge: parseInt(e.target.value) || undefined })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Enter spouse age"
        />
        {errors.spouseAge && <p className="mt-1 text-sm text-red-600">{errors.spouseAge}</p>}
      </div>

      <div>
        <label htmlFor="targetRetirementAge" className="block text-sm font-medium text-gray-700 mb-1">
          Target Retirement Age *
        </label>
        <input
          type="number"
          id="targetRetirementAge"
          value={data.targetRetirementAge || ''}
          onChange={(e) => onChange({ ...data, targetRetirementAge: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Enter target retirement age"
        />
        {errors.targetRetirementAge && <p className="mt-1 text-sm text-red-600">{errors.targetRetirementAge}</p>}
      </div>

      <div>
        <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700 mb-1">
          Risk Tolerance (1-10) *
        </label>
        <input
          type="range"
          id="riskTolerance"
          min="1"
          max="10"
          value={data.riskTolerance || 5}
          onChange={(e) => onChange({ ...data, riskTolerance: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Conservative (1)</span>
          <span className="font-semibold">{data.riskTolerance || 5}</span>
          <span>Aggressive (10)</span>
        </div>
        {errors.riskTolerance && <p className="mt-1 text-sm text-red-600">{errors.riskTolerance}</p>}
      </div>

      <div className="flex justify-end">
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
