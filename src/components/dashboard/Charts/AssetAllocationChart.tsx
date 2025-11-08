import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Assets } from '../../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AssetAllocationChartProps {
  assets: Assets;
}

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ assets }) => {
  const chartData = {
    labels: ['401(k)', 'Trad IRA', 'Roth IRA', 'Brokerage', 'Savings', 'Real Estate', 'Other'],
    datasets: [
      {
        label: 'Asset Value',
        data: [
          assets.retirement401k,
          assets.iraTraditional,
          assets.iraRoth,
          assets.brokerage,
          assets.savings,
          assets.realEstate,
          assets.other,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
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
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: { parsed: { y: number | null } }) {
            const value = context.parsed.y ?? 0;
            return `$${value.toLocaleString()}`;
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
      <Bar data={chartData} options={options} />
    </div>
  );
};
