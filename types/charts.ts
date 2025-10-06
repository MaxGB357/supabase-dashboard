// Chart.js configuration types

import { ChartOptions } from 'chart.js';

export interface RadarChartOptions extends ChartOptions<'radar'> {}
export interface DoughnutChartOptions extends ChartOptions<'doughnut'> {}
export interface BarChartOptions extends ChartOptions<'bar'> {}

export const chartColors = {
  blue: '#3b82f6',
  sky: '#0ea5e9',
  teal: '#14b8a6',
  emerald: '#10b981',
  rose: '#f43f5e',
  orange: '#f97316',
  purple: '#a855f7',
  yellow: '#eab308',
};
