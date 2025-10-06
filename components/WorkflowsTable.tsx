'use client';

// Workflows table component displaying ranked workflows
import React from 'react';
import type { WorkflowRanking } from '@/types/survey';

interface WorkflowsTableProps {
  workflows: WorkflowRanking[];
}

export default function WorkflowsTable({ workflows }: WorkflowsTableProps) {
  if (workflows.length === 0) {
    return (
      <section className="kpi-card mb-8">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Top Workflows Solicitados</h3>
        </div>
        <p className="text-gray-500 text-center py-8">No hay workflows disponibles para mostrar.</p>
      </section>
    );
  }

  const maxVotes = Math.max(...workflows.map(w => w.votes), 1);

  return (
    <section className="kpi-card mb-8">
      <div className="card-header">
        <h3 className="text-lg font-semibold">Top Workflows Solicitados</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">#</th>
              <th scope="col" className="px-4 py-3">Workflow</th>
              <th scope="col" className="px-4 py-3 text-center">Votaciones</th>
              <th scope="col" className="px-4 py-3 text-center">Dolor (1-5)</th>
              <th scope="col" className="px-4 py-3 text-center">Frecuencia</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow) => {
              const painColor = workflow.pain >= 4.0
                ? 'bg-red-500'
                : workflow.pain >= 3.5
                ? 'bg-yellow-500'
                : 'bg-green-500';

              const votePercentage = (workflow.votes / maxVotes) * 100;

              return (
                <tr key={workflow.rank} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {workflow.rank}
                  </th>
                  <td className="px-4 py-3">{workflow.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="mr-2 font-medium">{workflow.votes}</span>
                      <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="table-bar h-2.5 rounded-full"
                          style={{ width: `${votePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-white text-xs font-medium px-2.5 py-0.5 rounded-full ${painColor}`}>
                      {workflow.pain.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-gray-700 text-xs font-medium">{workflow.freq}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
