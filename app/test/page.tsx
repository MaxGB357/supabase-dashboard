// Test page to verify Supabase connection and table structure
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  let connectionStatus = 'Testing...';
  let dataCount = 0;
  let institutions: string[] = [];
  let sampleData = null;
  let error = null;
  let tableExists = false;
  let availableTables: string[] = [];

  try {
    const supabase = await createClient();

    // Test 1: Try to fetch from encuestas_unificadas
    const { data: surveyData, error: surveyError } = await supabase
      .from('encuestas_unificadas')
      .select('*')
      .limit(5);

    if (surveyError) {
      error = `Table query error: ${surveyError.message}`;
      tableExists = false;
    } else {
      dataCount = surveyData?.length || 0;
      sampleData = surveyData?.[0];
      tableExists = true;

      // Get unique institutions if data exists
      if (dataCount > 0) {
        const { data: instData } = await supabase
          .from('encuestas_unificadas')
          .select('institucion');

        institutions = [...new Set(instData?.map(d => d.institucion).filter(Boolean) || [])];
      }
    }

    // Test 2: Try to list all tables (this might not work due to RLS)
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (!tablesError && tablesData) {
      availableTables = tablesData.map(t => t.table_name);
    }

    // Test 3: Get table schema/structure (removed - not needed)

    connectionStatus = 'Connected ✓';
  } catch (e) {
    connectionStatus = 'Error ✗';
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className={`text-lg ${error ? 'text-red-600' : 'text-green-600'}`}>
            {connectionStatus}
          </p>
        </div>

        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <p>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
            </p>
            <p className="text-gray-600">{process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
            <p>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
            </p>
            <p className="text-gray-600">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
                : 'Not set'}
            </p>
          </div>
        </div>

        {/* Table Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Table: encuestas_unificadas</h2>
          <div className="space-y-2">
            <p>
              <strong>Table Exists:</strong>{' '}
              <span className={tableExists ? 'text-green-600' : 'text-red-600'}>
                {tableExists ? '✓ Yes' : '✗ No or Not Accessible'}
              </span>
            </p>
            <p>
              <strong>Records Found:</strong>{' '}
              <span className={dataCount > 0 ? 'text-green-600' : 'text-yellow-600'}>
                {dataCount}
              </span>
            </p>
          </div>
        </div>

        {/* Error Details */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Error Details</h2>
            <pre className="bg-red-100 p-4 rounded overflow-auto text-sm text-red-900">
              {error}
            </pre>
            <div className="mt-4 text-sm">
              <p className="font-semibold mb-2">Possible causes:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Table name is different (check Supabase dashboard)</li>
                <li>Row Level Security (RLS) is blocking access</li>
                <li>Table is in a different schema</li>
                <li>Anon key doesn't have read permissions</li>
              </ul>
            </div>
          </div>
        )}

        {/* Available Tables */}
        {availableTables.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Available Tables</h2>
            <div className="flex flex-wrap gap-2">
              {availableTables.map(table => (
                <span
                  key={table}
                  className={`px-3 py-1 rounded-full text-sm ${
                    table === 'encuestas_unificadas'
                      ? 'bg-green-100 text-green-800 font-semibold'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {table}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Data Stats */}
        {!error && dataCount > 0 && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Data Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Total Records (sample)</p>
                  <p className="text-3xl font-bold text-blue-600">{dataCount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Institutions</p>
                  <p className="text-3xl font-bold text-blue-600">{institutions.length}</p>
                </div>
              </div>
            </div>

            {/* Institutions List */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Institutions Found</h2>
              <div className="flex flex-wrap gap-2">
                {institutions.map(inst => (
                  <span
                    key={inst}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Data */}
            {sampleData && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Sample Record</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                  {JSON.stringify(sampleData, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}

        {/* No Data Found */}
        {!error && dataCount === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">No Data Found</h2>
            <p className="mb-4">The table exists but contains no records. Please check:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                <strong>Supabase Dashboard:</strong> Go to{' '}
                <a
                  href="https://supabase.com/dashboard/project/ekrtdfjiayzrstxdblni/editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Table Editor
                </a>{' '}
                and verify the table has data
              </li>
              <li>
                <strong>Table Name:</strong> Confirm the table is named exactly &quot;encuestas_unificadas&quot;
              </li>
              <li>
                <strong>Row Level Security (RLS):</strong> Check if RLS is enabled and blocking access
              </li>
            </ol>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Quick Actions</h2>
          <div className="space-y-2">
            <p>
              <strong>1. Check Supabase Dashboard:</strong>
            </p>
            <a
              href="https://supabase.com/dashboard/project/ekrtdfjiayzrstxdblni/editor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Open Table Editor →
            </a>
            <p className="mt-4">
              <strong>2. Check RLS Policies:</strong>
            </p>
            <a
              href="https://supabase.com/dashboard/project/ekrtdfjiayzrstxdblni/auth/policies"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Open RLS Policies →
            </a>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
