import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { RetirementData, RetirementAnalysis } from '../../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RetirementChartProps {
  data: RetirementData;
  analysis: RetirementAnalysis;
}

export const RetirementChart: React.FC<RetirementChartProps> = ({ data, analysis }) => {
  const yearsToRetirement = data.personalInfo.targetRetirementAge - data.personalInfo.age;
  const yearsInRetirement = 30;
  const totalYears = yearsToRetirement + yearsInRetirement;

  const labels = Array.from({ length: totalYears + 1 }, (_, i) => data.personalInfo.age + i);
  
  const totalAssets = Object.values(data.assets).reduce((a, b) => a + b, 0);
  const annualSavings = data.incomeSources.currentSalary * 0.15;
  
  const portfolioValues = labels.map((_age, index) => {
    if (index <= yearsToRetirement) {
      return totalAssets + (annualSavings * index * 1.07 ** index);
    } else {
      const yearsRetired = index - yearsToRetirement;
      const startValue = totalAssets + (annualSavings * yearsToRetirement * 1.07 ** yearsToRetirement);
      const withdrawal = analysis.requiredMonthlyIncome * 12;
      return Math.max(0, startValue * (1.05 ** yearsRetired) - (withdrawal * yearsRetired * 1.03 ** yearsRetired));
    }
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Projected Portfolio Value',
        data: portfolioValues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: { parsed: { y: number | null } }) {
            const value = context.parsed.y ?? 0;
            return `Portfolio: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            return '$' + (Number(value) / 1000).toFixed(0) + 'K';
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};
