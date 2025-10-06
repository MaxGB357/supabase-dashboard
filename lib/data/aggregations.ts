// Data aggregation functions for dashboard metrics
import type {
  SurveyRow,
  DashboardMetrics,
  MaturityMetrics,
  TimeDistribution,
  LLMUsage,
  WorkflowRanking,
  ChartData,
  WorkflowItem,
} from '@/types/survey';

/**
 * Calculate main KPI metrics for the dashboard
 */
export function calculateDashboardMetrics(data: SurveyRow[]): DashboardMetrics {
  if (data.length === 0) {
    return {
      totalParticipants: 0,
      avgFamiliaridad: 0,
      fortaleza: { valor: 0, label: 'N/A' },
      brecha: { valor: 0, label: 'N/A' },
    };
  }

  // Calculate average familiaridad score
  const familiaridadScores = data
    .map(d => d.familiaridad_score)
    .filter((s): s is number => s !== null && !isNaN(s));

  const avgFamiliaridad = familiaridadScores.length > 0
    ? familiaridadScores.reduce((a, b) => a + b, 0) / familiaridadScores.length
    : 0;

  // Define metric fields to analyze for fortaleza and brecha
  const metricFields = [
    { field: 'conocimiento_llm' as keyof SurveyRow, label: 'Conocimiento LLMs' },
    { field: 'conocimiento_prompts' as keyof SurveyRow, label: 'Prompt Engineering' },
    { field: 'conocimiento_agentes' as keyof SurveyRow, label: 'Conocimiento Agentes IA' },
    { field: 'org_lineamientos_ia' as keyof SurveyRow, label: 'Lineamientos Claros' },
    { field: 'org_acceso_herramientas' as keyof SurveyRow, label: 'Acceso Herramientas' },
    { field: 'org_impulso_direccion' as keyof SurveyRow, label: 'Impulso Directivo' },
    { field: 'percep_confianza_curiosidad' as keyof SurveyRow, label: 'Confianza/Curiosidad' },
    { field: 'percep_preocupa_reemplazo' as keyof SurveyRow, label: 'Preocupación Reemplazo' },
    { field: 'percep_preocupa_privacidad' as keyof SurveyRow, label: 'Preocupación Privacidad' },
    { field: 'percep_capacidad_aprender' as keyof SurveyRow, label: 'Curva Aprendizaje' },
    { field: 'percep_equipo_receptivo' as keyof SurveyRow, label: 'Equipo Receptivo' },
  ];

  const metricAverages = metricFields.map(({ field, label }) => {
    const values = data
      .map(d => d[field])
      .filter((v): v is number => typeof v === 'number' && v !== null && !isNaN(v));

    return {
      label,
      avg: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
    };
  });

  // Find max (fortaleza) and min (brecha), excluding zero averages
  const validMetrics = metricAverages.filter(m => m.avg > 0);
  const sorted = [...validMetrics].sort((a, b) => b.avg - a.avg);

  return {
    totalParticipants: data.length,
    avgFamiliaridad: Number(avgFamiliaridad.toFixed(2)),
    fortaleza: sorted.length > 0
      ? {
          valor: Number(sorted[0].avg.toFixed(2)),
          label: sorted[0].label,
        }
      : { valor: 0, label: 'N/A' },
    brecha: sorted.length > 0
      ? {
          valor: Number(sorted[sorted.length - 1].avg.toFixed(2)),
          label: sorted[sorted.length - 1].label,
        }
      : { valor: 0, label: 'N/A' },
  };
}

/**
 * Calculate maturity metrics for radar chart
 */
export function calculateMaturityMetrics(data: SurveyRow[]): MaturityMetrics {
  const metricFields = [
    { field: 'conocimiento_llm' as keyof SurveyRow, label: 'Conocimiento LLMs' },
    { field: 'conocimiento_prompts' as keyof SurveyRow, label: 'Prompt Engineering' },
    { field: 'conocimiento_agentes' as keyof SurveyRow, label: 'Entendimiento Agentes IA' },
    { field: 'org_lineamientos_ia' as keyof SurveyRow, label: 'Lineamientos Claros' },
    { field: 'org_acceso_herramientas' as keyof SurveyRow, label: 'Acceso a Herramientas' },
    { field: 'org_impulso_direccion' as keyof SurveyRow, label: 'Impulso Directivo' },
    { field: 'percep_confianza_curiosidad' as keyof SurveyRow, label: 'Confianza/Curiosidad' },
    { field: 'percep_preocupa_reemplazo' as keyof SurveyRow, label: 'Preocupación Reemplazo' },
    { field: 'percep_preocupa_privacidad' as keyof SurveyRow, label: 'Preocupación Privacidad' },
    { field: 'percep_capacidad_aprender' as keyof SurveyRow, label: 'Curva Aprendizaje' },
    { field: 'percep_equipo_receptivo' as keyof SurveyRow, label: 'Equipo Receptivo' },
  ];

  const labels = metricFields.map(m => m.label);
  const dataValues = metricFields.map(({ field }) => {
    const values = data
      .map(d => d[field])
      .filter((v): v is number => typeof v === 'number' && v !== null && !isNaN(v));

    return values.length > 0
      ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
      : 0;
  });

  return {
    labels,
    data: dataValues,
    insight: 'Métricas de madurez en IA del equipo evaluadas en escala de 1 a 5.',
  };
}

/**
 * Calculate time distribution for operational tasks
 */
export function calculateTimeDistribution(data: SurveyRow[]): TimeDistribution {
  const distribution: { [key: string]: number } = {};

  data.forEach(row => {
    const tiempo = row.tiempo_operativo;
    if (tiempo) {
      distribution[tiempo] = (distribution[tiempo] || 0) + 1;
    }
  });

  const labels = Object.keys(distribution).sort();
  const dataValues = labels.map(label => distribution[label]);

  const total = data.length;
  const under25Percent = total > 0
    ? ((distribution['0-25'] || 0) / total * 100).toFixed(0)
    : '0';

  return {
    labels,
    data: dataValues,
    insight: `El ${under25Percent}% del equipo dedica menos del 25% de su tiempo a tareas operativas.`,
  };
}

/**
 * Aggregate LLM usage from survey responses
 */
export function aggregateLLMUsage(data: SurveyRow[]): LLMUsage {
  const llmCount: { [key: string]: number } = {};

  data.forEach(row => {
    if (row.respuestas_especificas && typeof row.respuestas_especificas === 'object' && 'modelos_ia_utilizados' in row.respuestas_especificas) {
      const modelos = row.respuestas_especificas.modelos_ia_utilizados || [];
      modelos.forEach(modelo => {
        llmCount[modelo] = (llmCount[modelo] || 0) + 1;
      });
    }
  });

  const total = data.length;
  const sorted = Object.entries(llmCount).sort((a, b) => b[1] - a[1]);
  const labels = sorted.map(([name]) => name);
  const dataValues = sorted.map(([, count]) => total > 0 ? (count / total * 100) : 0);

  const topLLM = sorted[0]?.[0] || 'N/A';
  const topPercent = dataValues[0]?.toFixed(0) || '0';

  return {
    labels,
    data: dataValues,
    insight: `${topLLM} es la herramienta más utilizada (${topPercent}%).`,
  };
}

/**
 * Aggregate and rank workflows from survey responses
 */
export function aggregateWorkflows(data: SurveyRow[]): WorkflowRanking[] {
  const workflowVotes: { [name: string]: { count: number; painSum: number; freq: string } } = {};

  data.forEach(row => {
    if (row.workflows && Array.isArray(row.workflows)) {
      row.workflows.forEach((workflow: WorkflowItem) => {
        if (!workflowVotes[workflow.name]) {
          workflowVotes[workflow.name] = { count: 0, painSum: 0, freq: workflow.freq };
        }
        workflowVotes[workflow.name].count += 1;
        workflowVotes[workflow.name].painSum += parseFloat(workflow.dolor) || 0;
      });
    }
  });

  const ranked = Object.entries(workflowVotes)
    .map(([name, stats]) => ({
      name,
      votes: stats.count,
      pain: stats.count > 0 ? stats.painSum / stats.count : 0,
      freq: stats.freq,
    }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 15)
    .map((item, index) => ({
      rank: index + 1,
      name: item.name,
      votes: item.votes,
      pain: Number(item.pain.toFixed(1)),
      freq: item.freq === 'D' ? 'Diaria' : item.freq === 'S' ? 'Semanal' : 'Mensual',
    }));

  return ranked;
}

/**
 * Aggregate leader needs (lider_ia_necesidades field)
 */
export function aggregateLeaderNeeds(data: SurveyRow[]): ChartData {
  const needsCount: { [key: string]: number } = {};

  data.forEach(row => {
    if (row.lider_ia_necesidades) {
      const needs = row.lider_ia_necesidades.split('|').map(n => n.trim());
      needs.forEach(need => {
        if (need) {
          needsCount[need] = (needsCount[need] || 0) + 1;
        }
      });
    }
  });

  const total = data.length;
  const sorted = Object.entries(needsCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const labels = sorted.map(([name]) => name.split(' '));
  const dataValues = sorted.map(([, count]) => total > 0 ? (count / total * 100) : 0);

  return {
    labels,
    datasets: [{
      label: '% de Menciones',
      data: dataValues,
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }],
  };
}

/**
 * Aggregate principal benefits
 */
export function aggregateBenefits(data: SurveyRow[]): ChartData {
  const benefitsCount: { [key: string]: number } = {};

  data.forEach(row => {
    if (row.principal_beneficio) {
      const key = row.principal_beneficio.substring(0, 30); // Shorten for display
      benefitsCount[key] = (benefitsCount[key] || 0) + 1;
    }
  });

  const total = data.length;
  const sorted = Object.entries(benefitsCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const labels = sorted.map(([name]) => name.split(' '));
  const dataValues = sorted.map(([, count]) => total > 0 ? (count / total * 100) : 0);

  return {
    labels,
    datasets: [{
      label: '% de Menciones',
      data: dataValues,
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
    }],
  };
}

/**
 * Aggregate main concerns
 */
export function aggregateConcerns(data: SurveyRow[]): ChartData {
  const concernsCount: { [key: string]: number } = {};

  data.forEach(row => {
    if (row.mayor_preocupacion) {
      const key = row.mayor_preocupacion.substring(0, 30); // Shorten for display
      concernsCount[key] = (concernsCount[key] || 0) + 1;
    }
  });

  const total = data.length;
  const sorted = Object.entries(concernsCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const labels = sorted.map(([name]) => name.split(' '));
  const dataValues = sorted.map(([, count]) => total > 0 ? (count / total * 100) : 0);

  return {
    labels,
    datasets: [{
      label: '% de Menciones',
      data: dataValues,
      backgroundColor: 'rgba(244, 63, 94, 0.7)',
      borderColor: 'rgba(244, 63, 94, 1)',
      borderWidth: 1,
    }],
  };
}
