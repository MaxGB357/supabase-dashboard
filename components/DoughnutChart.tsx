'use client';

// Doughnut chart for time distribution
import React, { useEffect, useState } from 'react';
import type { TimeDistribution } from '@/types/survey';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { chartColors } from '@/types/charts';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: TimeDistribution;
  title?: string;
}

export default function DoughnutChart({ data, title = "Distribución de Tiempo en Tareas Operativas" }: DoughnutChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="kpi-card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="chart-container" style={{ height: '300px' }}>
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Cargando gráfico...</p>
          </div>
        </div>
      </div>
    );
  }

  const colors = [chartColors.blue, chartColors.sky, chartColors.orange, chartColors.teal];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Participantes',
        data: data.data,
        backgroundColor: colors.slice(0, data.labels.length),
        borderColor: '#ffffff',
        borderWidth: 2,
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
          boxWidth: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'doughnut'>) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1) + '%';
            label += `${value} (${percentage})`;
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="kpi-card">
      <div className="card-header">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{data.insight}</p>
      </div>
      <div className="chart-container" style={{ height: '300px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
