import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { MonthlyExpenses } from '../../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseBreakdownChartProps {
  expenses: MonthlyExpenses;
}

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({ expenses }) => {
  const essentialTotal = Object.values(expenses.essential).reduce((a, b) => a + b, 0);
  const discretionaryTotal = Object.values(expenses.discretionary).reduce((a, b) => a + b, 0);

  const chartData = {
    labels: [
      'Housing',
      'Utilities',
      'Food',
      'Healthcare',
      'Insurance',
      'Debt Payments',
      'Entertainment',
      'Travel',
      'Dining',
      'Hobbies',
      'Other',
    ],
    datasets: [
      {
        data: [
          expenses.essential.housing,
          expenses.essential.utilities,
          expenses.essential.food,
          expenses.essential.healthcare,
          expenses.essential.insurance,
          expenses.essential.debtPayments,
          expenses.discretionary.entertainment,
          expenses.discretionary.travel,
          expenses.discretionary.dining,
          expenses.discretionary.hobbies,
          expenses.discretionary.other,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(163, 163, 163, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: { label: string; parsed: number }) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = essentialTotal + discretionaryTotal;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(0)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
