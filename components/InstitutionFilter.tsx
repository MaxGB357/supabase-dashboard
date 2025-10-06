'use client';

// Filter dropdowns component for institution and survey type
import React from 'react';

interface InstitutionFilterProps {
  institutions: string[];
  selectedInstitution: string;
  onSelectInstitution: (institution: string) => void;
  tipoEncuestas: string[];
  selectedTipoEncuesta: string;
  onSelectTipoEncuesta: (tipo: string) => void;
}

export default function InstitutionFilter({
  institutions,
  selectedInstitution,
  onSelectInstitution,
  tipoEncuestas,
  selectedTipoEncuesta,
  onSelectTipoEncuesta,
}: InstitutionFilterProps) {
  const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectInstitution(e.target.value);
  };

  const handleTipoEncuestaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectTipoEncuesta(e.target.value);
  };

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Institution Filter */}
      <div>
        <label
          htmlFor="institution-filter"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Filtrar por Institución
        </label>
        <select
          id="institution-filter"
          value={selectedInstitution}
          onChange={handleInstitutionChange}
          className="block w-full px-4 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm bg-white"
        >
          {institutions.map(inst => (
            <option key={inst} value={inst}>
              {inst}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo Encuesta Filter */}
      <div>
        <label
          htmlFor="tipo-encuesta-filter"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Filtrar por Tipo de Encuesta
        </label>
        <select
          id="tipo-encuesta-filter"
          value={selectedTipoEncuesta}
          onChange={handleTipoEncuestaChange}
          className="block w-full px-4 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm bg-white"
        >
          {tipoEncuestas.map(tipo => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
