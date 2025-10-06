'use client';

// Horizontal bar chart component
import React, { useEffect, useState } from 'react';
import type { ChartData } from '@/types/survey';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData as ChartJSData,
  TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: ChartData;
  title: string;
  insight?: string;
}

export default function BarChart({ data, title, insight }: BarChartProps) {
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
        <div className="chart-container" style={{ height: '350px' }}>
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Cargando gráfico...</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert labels to Chart.js format
  const chartData: ChartJSData<'bar', number[], string> = {
    labels: data.labels as string[],
    datasets: data.datasets.map(ds => ({
      ...ds,
      data: ds.data,
    })),
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value: string | number) {
            return value + '%';
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'bar'>) {
            return context.dataset.label + ': ' + context.parsed.x.toFixed(1) + '%';
          },
        },
      },
    },
  };

  return (
    <div className="kpi-card">
      <div className="card-header">
        <h3 className="text-lg font-semibold">{title}</h3>
        {insight && <p className="text-sm text-gray-500 mt-1">{insight}</p>}
      </div>
      <div className="chart-container" style={{ height: '350px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
