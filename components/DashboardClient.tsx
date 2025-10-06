'use client';

// Main dashboard client component with filtering logic
import React, { useState, useMemo } from 'react';
import type { SurveyRow } from '@/types/survey';
import InstitutionFilter from './InstitutionFilter';
import KPICards from './KPICards';
import RadarChart from './RadarChart';
import DoughnutChart from './DoughnutChart';
import BarChart from './BarChart';
import WorkflowsTable from './WorkflowsTable';
import {
  calculateDashboardMetrics,
  calculateMaturityMetrics,
  calculateTimeDistribution,
  aggregateLLMUsage,
  aggregateWorkflows,
  aggregateLeaderNeeds,
  aggregateBenefits,
  aggregateConcerns,
} from '@/lib/data/aggregations';

interface DashboardClientProps {
  initialData: SurveyRow[];
  institutions: string[];
  tipoEncuestas: string[];
}

export default function DashboardClient({ initialData, institutions, tipoEncuestas }: DashboardClientProps) {
  const [selectedInstitution, setSelectedInstitution] = useState('Todas');
  const [selectedTipoEncuesta, setSelectedTipoEncuesta] = useState('Todas');

  // Filter data based on selected institution and tipo_encuesta
  const filteredData = useMemo(() => {
    let filtered = initialData;

    // Filter by institution
    if (selectedInstitution !== 'Todas') {
      filtered = filtered.filter(d => d.institucion === selectedInstitution);
    }

    // Filter by tipo_encuesta
    if (selectedTipoEncuesta !== 'Todas') {
      filtered = filtered.filter(d => d.tipo_encuesta === selectedTipoEncuesta);
    }

    return filtered;
  }, [initialData, selectedInstitution, selectedTipoEncuesta]);

  // Calculate all metrics from filtered data
  const metrics = useMemo(() => calculateDashboardMetrics(filteredData), [filteredData]);
  const maturityMetrics = useMemo(() => calculateMaturityMetrics(filteredData), [filteredData]);
  const timeDistribution = useMemo(() => calculateTimeDistribution(filteredData), [filteredData]);
  const llmUsage = useMemo(() => aggregateLLMUsage(filteredData), [filteredData]);
  const workflows = useMemo(() => aggregateWorkflows(filteredData), [filteredData]);
  const leaderNeeds = useMemo(() => aggregateLeaderNeeds(filteredData), [filteredData]);
  const benefits = useMemo(() => aggregateBenefits(filteredData), [filteredData]);
  const concerns = useMemo(() => aggregateConcerns(filteredData), [filteredData]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Filters */}
      <InstitutionFilter
        institutions={institutions}
        selectedInstitution={selectedInstitution}
        onSelectInstitution={setSelectedInstitution}
        tipoEncuestas={tipoEncuestas}
        selectedTipoEncuesta={selectedTipoEncuesta}
        onSelectTipoEncuesta={setSelectedTipoEncuesta}
      />

      {/* KPI Cards */}
      <KPICards metrics={metrics} />

      {/* Time Distribution Chart */}
      <section className="grid grid-cols-1 gap-6 mb-8">
        <DoughnutChart data={timeDistribution} />
      </section>

      {/* Maturity Metrics Radar Chart */}
      <RadarChart data={maturityMetrics} />

      {/* LLMs Usage Chart */}
      {llmUsage.labels.length > 0 && (
        <section className="mb-8">
          <BarChart
            data={{
              labels: llmUsage.labels,
              datasets: [{
                label: '% de Uso',
                data: llmUsage.data,
                backgroundColor: 'rgba(168, 85, 247, 0.7)',
                borderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 1,
              }],
            }}
            title="LLMs Más Utilizados"
            insight={llmUsage.insight}
          />
        </section>
      )}

      {/* Workflows Table */}
      <WorkflowsTable workflows={workflows} />

      {/* Open Questions Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Leader Needs */}
        {leaderNeeds.labels.length > 0 && (
          <BarChart
            data={leaderNeeds}
            title="Necesidades de Líderes IA"
            insight="Principales necesidades identificadas por los líderes"
          />
        )}

        {/* Benefits */}
        {benefits.labels.length > 0 && (
          <BarChart
            data={benefits}
            title="Principal Beneficio Percibido de la IA"
            insight="Beneficios más mencionados"
          />
        )}

        {/* Concerns */}
        {concerns.labels.length > 0 && (
          <BarChart
            data={concerns}
            title="Mayor Preocupación o Reto"
            insight="Principales preocupaciones identificadas"
          />
        )}
      </section>
    </div>
  );
}
