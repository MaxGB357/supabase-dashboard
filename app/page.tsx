// Main dashboard page - Server Component
import { fetchSurveysByInstitution, getUniqueInstitutions } from '@/lib/supabase/queries';
import DashboardClient from '@/components/DashboardClient';
import DashboardLayout from '@/components/DashboardLayout';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch data on server for initial load
  const [allData, institutions] = await Promise.all([
    fetchSurveysByInstitution(), // No filter = get all data
    getUniqueInstitutions(),
  ]);

  return (
    <DashboardLayout>
      <DashboardClient initialData={allData} institutions={institutions} />
    </DashboardLayout>
  );
}
