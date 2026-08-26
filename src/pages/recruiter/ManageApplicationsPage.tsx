import React, { useState } from 'react';
import { useJob } from '../../context/JobContext';
import { Application, ApplicationStatus } from '../../types';
import { CandidatePipelineCard } from '../../components/recruiter/CandidatePipelineCard';
import { CandidateModal } from '../../components/recruiter/CandidateModal';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';

export const ManageApplicationsPage: React.FC = () => {
  const { applications, jobs } = useJob();

  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredApplications = applications.filter((app) => {
    if (selectedJobId === 'all') return true;
    return app.jobId === selectedJobId;
  });

  const columns: { id: ApplicationStatus; title: string; color: string }[] = [
    { id: 'Nouveau', title: 'Nouveau', color: 'border-t-primary' },
    { id: 'En revue', title: 'En revue / Présélection', color: 'border-t-amber-500' },
    { id: 'Entretien', title: 'Entretien programmé', color: 'border-t-secondary' },
    { id: 'Retenu', title: 'Retenu / Offre validée', color: 'border-t-emerald-600' },
    { id: 'Refusé', title: 'Refusé', color: 'border-t-error' }
  ];

  const handleCardClick = (app: Application) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const jobFilterOptions = [
    { value: 'all', label: 'Toutes les offres d\'emploi' },
    ...jobs.map((j) => ({ value: j.id, label: j.title }))
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
            Pipeline des Candidatures
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Gérez le processus de recrutement étape par étape.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-64">
            <Select
              options={jobFilterOptions}
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-surface-variant/40 p-1 rounded-lg border border-outline-variant/20">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'kanban'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
              title="Vue Kanban"
            >
              <span className="material-symbols-outlined text-[18px]">view_kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
              title="Vue Tableau"
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colApps = filteredApplications.filter((a) => {
              if (col.id === 'Nouveau') return a.status === 'Nouveau' || a.status === 'En attente';
              return a.status === col.id;
            });

            return (
              <div
                key={col.id}
                className={`bg-surface-container-low rounded-2xl p-3.5 border border-outline-variant/30 flex flex-col gap-3 min-w-[220px] ${col.color} border-t-4`}
              >
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                    {col.title}
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-surface-variant text-primary font-bold text-[11px] flex items-center justify-center">
                    {colApps.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {colApps.map((app) => (
                    <CandidatePipelineCard
                      key={app.id}
                      application={app}
                      onClick={() => handleCardClick(app)}
                    />
                  ))}
                  {colApps.length === 0 && (
                    <div className="h-24 rounded-xl border border-dashed border-outline-variant/40 flex items-center justify-center text-[11px] text-on-surface-variant/60 text-center p-2">
                      Aucun candidat
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-soft overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/20 text-on-surface-variant font-bold uppercase tracking-wider">
                <th className="pb-3">Candidat</th>
                <th className="pb-3">Poste visé</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Score IA</th>
                <th className="pb-3">Statut actuel</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={app.candidateAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                        alt={app.candidateName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-bold text-primary block">{app.candidateName}</span>
                        <span className="text-[10px] text-on-surface-variant">{app.candidateTitle}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-primary">
                    {app.jobTitle}
                  </td>
                  <td className="py-3.5 pr-4 text-on-surface-variant">
                    <div>{app.candidatePhone}</div>
                    <div className="text-[10px]">{app.candidateEmail}</div>
                  </td>
                  <td className="py-3.5 pr-4 text-on-surface-variant">
                    {app.appliedDate}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-bold text-[11px]">
                      {app.matchScore || 90}%
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-variant text-primary">
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCardClick(app)}
                    >
                      Évaluer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Modal */}
      <CandidateModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
