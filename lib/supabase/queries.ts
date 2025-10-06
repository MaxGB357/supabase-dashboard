// Data fetching functions for Supabase
import { createClient } from './server';
import type { SurveyRow, WorkflowItem, RespuestasEspecificas } from '@/types/survey';

// Helper function to parse JSON fields that might be strings
function parseJSONField<T>(field: T | string | null): T | null {
  if (!field) return null;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch (e) {
      console.error('Failed to parse JSON field:', e);
      return null;
    }
  }
  return field as T;
}

/**
 * Fetch all surveys or filter by institution
 * @param institucion - Optional institution filter
 * @returns Array of survey responses with parsed JSON fields
 */
export async function fetchSurveysByInstitution(institucion?: string): Promise<SurveyRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from('encuestas_unificadas')
    .select('*');

  // Only filter if institution is provided and not "Todas"
  if (institucion && institucion !== 'Todas') {
    query = query.eq('institucion', institucion);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase query error:', error);
    return [];
  }

  if (!data) return [];

  // Parse JSON fields that might be strings
  return data.map(row => ({
    ...row,
    workflows: parseJSONField<WorkflowItem[]>(row.workflows),
    respuestas_especificas: parseJSONField<RespuestasEspecificas>(row.respuestas_especificas),
  })) as SurveyRow[];
}

/**
 * Get unique institutions for dropdown filter
 * @returns Array of institution names including "Todas"
 */
export async function getUniqueInstitutions(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('encuestas_unificadas')
    .select('institucion');

  if (error) {
    console.error('Error fetching institutions:', error);
    return ['Todas'];
  }

  if (!data) return ['Todas'];

  // Extract unique non-null values and sort
  const unique = [...new Set(data.map(d => d.institucion).filter(Boolean))];
  return ['Todas', ...unique.sort()];
}
