import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { JobStatus } from '../../types';

export const ManageJobsPage: React.FC = () => {
  const navigate = useNavigate();
const { jobs: allJobs, applications, updateJobStatus, deleteJob } = useJob();
const { user } = useAuth();
  const { showToast } = useToast();

  // Un recruteur ne doit voir/gérer que SES PROPRES offres
  const jobs = allJobs.filter((job) => job.ownerId === user?.id);

  // Nombre réel de candidatures par offre, calculé depuis les vraies
  // candidatures (le compteur stocké sur l'offre n'est pas fiable : le
  // candidat qui postule ne peut pas l'incrémenter lui-même côté Appwrite).
  const applicantsCountByJob = applications.reduce<Record<string, number>>((acc, app) => {
    acc[app.jobId] = (acc[app.jobId] || 0) + 1;
    return acc;
  }, {});

  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Toutes les offres', count: jobs.length },
    { id: 'Ouvert', label: 'Actives', count: jobs.filter((j) => j.status === 'Ouvert' || j.status === 'Nouveau').length },
    { id: 'Clôture bientôt', label: 'Clôture proche', count: jobs.filter((j) => j.status === 'Clôture bientôt').length },
    { id: 'Clôturé', label: 'Clôturées', count: jobs.filter((j) => j.status === 'Clôturé').length },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'Ouvert') return job.status === 'Ouvert' || job.status === 'Nouveau';
    return job.status === activeTab;
  });

  const handleToggleStatus = async (jobId: string, currentStatus: JobStatus) => {
    const nextStatus: JobStatus = currentStatus === 'Clôturé' ? 'Ouvert' : 'Clôturé';
    try {
      await updateJobStatus(jobId, nextStatus);
      showToast(
        'Statut d\'offre modifié',
        `L'offre est désormais ${nextStatus === 'Ouvert' ? 'ouverte aux candidatures' : 'clôturée'}.`,
        'info'
      );
    } catch (error) {
      showToast(
        'Erreur',
        'Impossible de modifier le statut de l\'offre. Réessayez.',
        'error'
      );
    }
  };

  const handleEdit = (jobId: string) => {
  navigate(`/recruteur/modifier-offre/${jobId}`);
};

const handleDelete = async (jobId: string) => {
  const confirmed = window.confirm(
    'Voulez-vous vraiment supprimer cette offre ? Cette action est irréversible.'
  );

  if (!confirmed) return;

  try {
    await deleteJob(jobId);

    showToast(
      'Offre supprimée',
      'L’offre a été supprimée avec succès.',
      'success'
    );
  } catch (error) {
    console.error('Erreur suppression offre :', error);

    showToast(
      'Erreur',
      'Impossible de supprimer cette offre.',
      'error'
    );
  }
};
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Gestion des Offres d'Emploi</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Contrôlez la visibilité de vos annonces et suivez leurs performances.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/recruteur/publier-offre')}
          leftIcon={<span className="material-symbols-outlined text-[18px]">add_circle</span>}
        >
          Créer une annonce
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Jobs List Table / Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-soft hover:shadow-lift transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-lg text-primary">{job.title}</h3>
                <Badge
                  variant={
                    job.status === 'Ouvert' || job.status === 'Nouveau'
                      ? 'success'
                      : job.status === 'Clôture bientôt'
                      ? 'warning'
                      : 'neutral'
                  }
                >
                  {job.status}
                </Badge>
                <span className="text-xs text-on-surface-variant bg-surface-variant/40 px-2.5 py-0.5 rounded-full">
                  {job.contractType} • {job.workMode}
                </span>
              </div>

              <p className="text-xs text-on-surface-variant flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {job.location}, Togo
                </span>
                <span>•</span>
                <span>Publié le {job.postedDate}</span>
                <span>•</span>
                <span>Date limite : {job.deadline}</span>
              </p>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-6 py-3 lg:py-0 border-y lg:border-y-0 border-outline-variant/20">
              <div className="text-center">
                <span className="text-xl font-bold text-primary block">
                  {applicantsCountByJob[job.id] || 0}
                </span>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Candidats
                </span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-primary block">
                  {job.viewsCount || 1}
                </span>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Vues
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/recruteur/candidatures"
                className="px-3 py-2 rounded-lg bg-primary-fixed text-primary text-xs font-bold hover:bg-primary-fixed-dim transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">groups</span>
                Pipeline ({applicantsCountByJob[job.id] || 0})
              </Link>
              <Link
                to={`/offres/${job.id}`}
                className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                title="Voir en ligne"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
              </Link>
              <button
  onClick={() => handleEdit(job.id)}
  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary text-primary hover:bg-primary/10 transition-colors flex items-center gap-1"
  title="Modifier l'offre"
>
  <span className="material-symbols-outlined text-[16px]">
    edit
  </span>
  Modifier
</button>
<button
  onClick={() => handleDelete(job.id)}
  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-error text-error hover:bg-error/10 transition-colors flex items-center gap-1"
  title="Supprimer l'offre"
>
  <span className="material-symbols-outlined text-[16px]">
    delete
  </span>
  Supprimer
</button>
              <button
                onClick={() => handleToggleStatus(job.id, job.status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  job.status === 'Clôturé'
                    ? 'border-secondary text-secondary hover:bg-secondary/10'
                    : 'border-outline text-outline hover:text-error hover:border-error'
                }`}
              >
                {job.status === 'Clôturé' ? 'Rouvrir' : 'Clôturer'}
              </button>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
