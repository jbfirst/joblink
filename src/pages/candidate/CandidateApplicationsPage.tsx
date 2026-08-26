import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';
import { Tabs } from '../../components/common/Tabs';
import { ApplicationCard } from '../../components/candidate/ApplicationCard';
import { EmptyState } from '../../components/common/EmptyState';

export const CandidateApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { applications, candidateProfile } = useJob();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('all');

  const userApplications = applications.filter(
    (app) => app.candidateId === candidateProfile.id || app.candidateName === candidateProfile.fullName
  );

  const tabs = [
    { id: 'all', label: 'Toutes', count: userApplications.length },
    { id: 'En attente', label: 'En attente', count: userApplications.filter((a) => a.status === 'Nouveau' || a.status === 'En attente').length },
    { id: 'En revue', label: 'En revue', count: userApplications.filter((a) => a.status === 'En revue').length },
    { id: 'Entretien', label: 'Entretiens', count: userApplications.filter((a) => a.status === 'Entretien').length },
    { id: 'Retenu', label: 'Retenues', count: userApplications.filter((a) => a.status === 'Retenu').length },
    { id: 'Refusé', label: 'Refusées', count: userApplications.filter((a) => a.status === 'Refusé').length },
  ];

  const filteredApplications = userApplications.filter((app) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'En attente') return app.status === 'Nouveau' || app.status === 'En attente';
    return app.status === activeTab;
  });

  const handleWithdraw = (_appId: string) => {
    showToast(
      'Candidature retirée',
      'Votre candidature a été retirée avec succès.',
      'info'
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Mes Candidatures</h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Suivez l'état d'avancement de vos dossiers de candidature en temps réel.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          title="Aucune candidature trouvée"
          description={
            activeTab === 'all'
              ? 'Vous n\'avez pas encore postulé à des offres d\'emploi sur JobLink Togo.'
              : `Aucune candidature dans la catégorie "${activeTab}".`
          }
          actionText="Explorer les offres d'emploi"
          onAction={() => navigate('/offres')}
        />
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onWithdraw={handleWithdraw}
            />
          ))}
        </div>
      )}
    </div>
  );
};
