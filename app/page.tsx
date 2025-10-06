// Main dashboard page - Server Component
import { fetchSurveysByInstitution, getUniqueInstitutions, getUniqueTipoEncuestas } from '@/lib/supabase/queries';
import DashboardClient from '@/components/DashboardClient';
import DashboardLayout from '@/components/DashboardLayout';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch data on server for initial load
  const [allData, institutions, tipoEncuestas] = await Promise.all([
    fetchSurveysByInstitution(), // No filter = get all data
    getUniqueInstitutions(),
    getUniqueTipoEncuestas(),
  ]);

  return (
    <DashboardLayout>
      <DashboardClient
        initialData={allData}
        institutions={institutions}
        tipoEncuestas={tipoEncuestas}
      />
    </DashboardLayout>
  );
}
