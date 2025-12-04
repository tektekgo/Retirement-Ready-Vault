import React from 'react';
import { MonthlyExpenses } from '../../types';

interface ExpensesStepProps {
  data: MonthlyExpenses;
  onChange: (data: MonthlyExpenses) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ExpensesStep: React.FC<ExpensesStepProps> = ({ data, onChange, onNext, onBack }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    const essentialValues = Object.values(data.essential);
    const discretionaryValues = Object.values(data.discretionary);
    
    if (essentialValues.some(v => v < 0)) {
      newErrors.essential = 'Essential expenses cannot be negative';
    }
    
    if (discretionaryValues.some(v => v < 0)) {
      newErrors.discretionary = 'Discretionary expenses cannot be negative';
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

  const totalEssential = Object.values(data.essential).reduce((a, b) => a + b, 0);
  const totalDiscretionary = Object.values(data.discretionary).reduce((a, b) => a + b, 0);
  const totalMonthly = totalEssential + totalDiscretionary;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly Expenses</h2>
        <p className="text-gray-600">Help us understand your current monthly spending.</p>
      </div>

      <div className="bg-teal-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Essential Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="housing" className="block text-sm font-medium text-gray-700 mb-1">
              Housing (Rent/Mortgage)
            </label>
            <input
              type="number"
              id="housing"
              value={data.essential.housing || ''}
              onChange={(e) => onChange({ ...data, essential: { ...data.essential, housing: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="utilities" className="block text-sm font-medium text-gray-700 mb-1">
              Utilities
            </label>
            <input
              type="number"
              id="utilities"
              value={data.essential.utilities || ''}
              onChange={(e) => onChange({ ...data, essential: { ...data.essential, utilities: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="food" className="block text-sm font-medium text-gray-700 mb-1">
              Food/Groceries
            </label>
            <input
              type="number"
              id="food"
              value={data.essential.food || ''}
              onChange={(e) => onChange({ ...data, essential: { ...data.essential, food: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="healthcare" className="block text-sm font-medium text-gray-700 mb-1">
              Healthcare
            </label>
            <input
              type="number"
              id="healthcare"
              value={data.essential.healthcare || ''}
              onChange={(e) => onChange({ ...data, essential: { ...data.essential, healthcare: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance
            </label>
            <input
              type="number"
              id="insurance"
              value={data.essential.insurance || ''}
              onChange={(e) => onChange({ ...data, essential: { ...data.essential, insurance: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="debtPayments" className="block text-sm font-medium text-gray-700 mb-1">
              Debt Payments
            </label>
            <input
              type="number"
              id="debtPayments"
              value={data.essential.debtPayments || ''}
              onChange={(e) => onChange({ ...data, essential: { ...data.essential, debtPayments: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
        <div className="mt-3 text-right">
          <span className="text-sm font-semibold text-gray-700">Essential Total: ${totalEssential.toFixed(2)}</span>
        </div>
        {errors.essential && <p className="mt-1 text-sm text-red-600">{errors.essential}</p>}
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Discretionary Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="entertainment" className="block text-sm font-medium text-gray-700 mb-1">
              Entertainment
            </label>
            <input
              type="number"
              id="entertainment"
              value={data.discretionary.entertainment || ''}
              onChange={(e) => onChange({ ...data, discretionary: { ...data.discretionary, entertainment: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="travel" className="block text-sm font-medium text-gray-700 mb-1">
              Travel
            </label>
            <input
              type="number"
              id="travel"
              value={data.discretionary.travel || ''}
              onChange={(e) => onChange({ ...data, discretionary: { ...data.discretionary, travel: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="dining" className="block text-sm font-medium text-gray-700 mb-1">
              Dining Out
            </label>
            <input
              type="number"
              id="dining"
              value={data.discretionary.dining || ''}
              onChange={(e) => onChange({ ...data, discretionary: { ...data.discretionary, dining: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700 mb-1">
              Hobbies
            </label>
            <input
              type="number"
              id="hobbies"
              value={data.discretionary.hobbies || ''}
              onChange={(e) => onChange({ ...data, discretionary: { ...data.discretionary, hobbies: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="other" className="block text-sm font-medium text-gray-700 mb-1">
              Other
            </label>
            <input
              type="number"
              id="other"
              value={data.discretionary.other || ''}
              onChange={(e) => onChange({ ...data, discretionary: { ...data.discretionary, other: parseFloat(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
        <div className="mt-3 text-right">
          <span className="text-sm font-semibold text-gray-700">Discretionary Total: ${totalDiscretionary.toFixed(2)}</span>
        </div>
        {errors.discretionary && <p className="mt-1 text-sm text-red-600">{errors.discretionary}</p>}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900">Total Monthly Expenses: ${totalMonthly.toFixed(2)}</span>
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
