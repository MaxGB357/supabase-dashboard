'use client';

// KPI cards component displaying main metrics
import React from 'react';
import type { DashboardMetrics } from '@/types/survey';

interface KPICardsProps {
  metrics: DashboardMetrics;
}

export default function KPICards({ metrics }: KPICardsProps) {
  return (
    <section id="kpi-section" className="mb-8">
      <h2 className="text-xl font-bold mb-4">Análisis Global - Perfil de Participantes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Participants */}
        <div className="kpi-card text-center">
          <h3 className="text-lg font-semibold text-gray-500">Total Participantes</h3>
          <p className="text-4xl font-extrabold text-blue-600 mt-2">
            {metrics.totalParticipants}
          </p>
        </div>

        {/* Average Familiaridad */}
        <div className="kpi-card text-center">
          <h3 className="text-lg font-semibold text-gray-500">Familiaridad con IA</h3>
          <p className="text-4xl font-extrabold text-blue-600 mt-2">
            {metrics.avgFamiliaridad.toFixed(2)}
            <span className="text-2xl text-gray-400">/5</span>
          </p>
        </div>

        {/* Fortaleza */}
        <div className="kpi-card text-center">
          <h3 className="text-lg font-semibold text-gray-500">Mayor Fortaleza</h3>
          <p className="text-4xl font-extrabold text-emerald-600 mt-2">
            {metrics.fortaleza.valor.toFixed(2)}
            <span className="text-2xl text-gray-400">/5</span>
          </p>
          <span className="text-sm text-gray-500">{metrics.fortaleza.label}</span>
        </div>

        {/* Brecha */}
        <div className="kpi-card text-center">
          <h3 className="text-lg font-semibold text-gray-500">Principal Brecha</h3>
          <p className="text-4xl font-extrabold text-rose-600 mt-2">
            {metrics.brecha.valor.toFixed(2)}
            <span className="text-2xl text-gray-400">/5</span>
          </p>
          <span className="text-sm text-gray-500">{metrics.brecha.label}</span>
        </div>
      </div>
    </section>
  );
}
