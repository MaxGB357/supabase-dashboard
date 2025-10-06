// Survey response types based on Supabase database schema

export interface WorkflowItem {
  freq: 'D' | 'S' | 'M'; // Daily, Weekly, Monthly
  name: string;
  dolor: string; // Pain level 1-5
  nivel: 'Personal' | 'Equipo' | 'Ambos' | 'N/A';
  output?: string;
}

export interface RespuestasEspecificas {
  ranking_workflows: string[];
  modelos_ia_utilizados: string[];
}

export interface SurveyRow {
  idx: string; // Changed to string (text in DB)
  id: number | null;
  created_at: string | null;
  institucion: string | null; // FILTER FIELD
  tipo_encuesta: string | null; // Changed from strict type to string
  nombre_completo: string | null;
  cargo_actual: string | null;
  area_departamento: string | null;
  tamano_equipo: string | null;
  tiempo_operativo: string | null;

  // Metrics (1-5 scale, bigint in DB)
  familiaridad_score: number | null;
  conocimiento_llm: number | null;
  conocimiento_prompts: number | null;
  conocimiento_agentes: number | null;
  conocimiento_rag: string | null; // Changed to string (text in DB)
  org_lineamientos_ia: number | null;
  org_acceso_herramientas: number | null;
  org_impulso_direccion: number | null;
  percep_confianza_curiosidad: number | null;
  percep_preocupa_reemplazo: number | null;
  percep_preocupa_privacidad: number | null;
  percep_capacidad_aprender: number | null;
  percep_equipo_receptivo: number | null;

  // Final survey fields
  talleres_asistidos_0: string | null; // Renamed (no special characters)
  talleres_asistidos_1: string | null; // Renamed (no special characters)
  talleres_asistidos_2: string | null; // Renamed (no special characters)
  talleres_asistidos_3: string | null; // Renamed (no special characters)
  cambio_confianza: string | null;
  desarrollo_herramientas: string | null;
  descripcion_desarrollos: string | null;
  ahorro_tiempo: string | null;
  calificacion_programa: string | null; // Changed to string (text in DB)
  taller_mas_valioso: string | null;
  nps_score: string | null; // Changed to string (text in DB)

  // Text fields
  lider_ia_necesidades: string | null;
  principal_beneficio: string | null;
  mayor_preocupacion: string | null;
  necesidades_futuras: string | null;
  comentario_final: string | null;
  ideas_ia: string | null;

  // Nested JSON fields (jsonb in DB)
  respuestas_especificas: RespuestasEspecificas | object | null;
  workflows: WorkflowItem[] | object | null;
  metadata: object | null;
}

export interface DashboardMetrics {
  totalParticipants: number;
  avgFamiliaridad: number;
  fortaleza: {
    valor: number;
    label: string;
  };
  brecha: {
    valor: number;
    label: string;
  };
}

export interface TimeDistribution {
  labels: string[];
  data: number[];
  insight: string;
}

export interface MaturityMetrics {
  labels: string[];
  data: number[];
  insight: string;
}

export interface LLMUsage {
  labels: string[];
  data: number[];
  insight: string;
}

export interface WorkflowRanking {
  rank: number;
  name: string;
  votes: number;
  pain: number;
  freq: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointHoverBackgroundColor?: string;
  pointHoverBorderColor?: string;
}

export interface ChartData {
  labels: string[] | string[][];
  datasets: ChartDataset[];
}
