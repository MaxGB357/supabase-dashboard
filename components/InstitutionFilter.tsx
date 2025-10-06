'use client';

// Institution filter dropdown component
import React from 'react';

interface InstitutionFilterProps {
  institutions: string[];
  selectedInstitution: string;
  onSelectInstitution: (institution: string) => void;
}

export default function InstitutionFilter({
  institutions,
  selectedInstitution,
  onSelectInstitution,
}: InstitutionFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectInstitution(e.target.value);
  };

  return (
    <div className="mb-8">
      <label
        htmlFor="institution-filter"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Filtrar por Institución
      </label>
      <select
        id="institution-filter"
        value={selectedInstitution}
        onChange={handleChange}
        className="block w-full md:w-64 px-4 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm bg-white"
      >
        {institutions.map(inst => (
          <option key={inst} value={inst}>
            {inst}
          </option>
        ))}
      </select>
    </div>
  );
}
