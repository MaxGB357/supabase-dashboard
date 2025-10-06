'use client';

// Radar chart for maturity metrics
import React, { useEffect, useState } from 'react';
import type { MaturityMetrics } from '@/types/survey';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: MaturityMetrics;
  title?: string;
}

export default function RadarChart({ data, title = "Métricas de Evaluación de Madurez IA" }: RadarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="kpi-card mb-8">
        <div className="card-header">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="chart-container" style={{ height: '400px' }}>
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Cargando gráfico...</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Promedio Global',
        data: data.data,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 5,
        pointLabels: {
          font: { size: 10 },
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'radar'>) {
            return context.dataset.label + ': ' + context.parsed.r.toFixed(1);
          },
        },
      },
    },
  };

  return (
    <section className="kpi-card mb-8">
      <div className="card-header">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{data.insight}</p>
      </div>
      <div className="chart-container" style={{ height: '400px' }}>
        <Radar data={chartData} options={options} />
      </div>
    </section>
  );
}
