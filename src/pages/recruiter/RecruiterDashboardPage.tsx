import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { KpiCard } from '../../components/recruiter/KpiCard';
import { Button } from '../../components/common/Button';
import { CandidateModal } from '../../components/recruiter/CandidateModal';
import { Application } from '../../types';

export const RecruiterDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs: allJobs, applications } = useJob();
  const { user } = useAuth();

  // Un recruteur ne voit que SES propres offres sur son dashboard
  const jobs = allJobs.filter((j) => j.ownerId === user?.id);

  // Nombre réel de candidatures par offre (voir ManageJobsPage pour le détail)
  const applicantsCountByJob = applications.reduce<Record<string, number>>((acc, app) => {
    acc[app.jobId] = (acc[app.jobId] || 0) + 1;
    return acc;
  }, {});

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);

  const activeJobs = jobs.filter((j) => j.status !== 'Clôturé');
  const recentApplications = applications.slice(0, 5);

  const handleOpenCandidate = (app: Application) => {
    setSelectedApplication(app);
    setIsCandidateModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Section (Fidèle à Stitch espace_recruteur) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
            Espace Recruteur • TechHub Lomé
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gérez vos offres actives et suivez vos candidatures en temps réel.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/recruteur/publier-offre')}
          leftIcon={<span className="material-symbols-outlined text-[20px]">add_circle</span>}
        >
          Publier une offre
        </Button>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Offres actives"
          value={activeJobs.length}
          icon="work"
          trend="+2 ce mois"
          trendPositive={true}
          colorVariant="primary"
        />
        <KpiCard
          title="Total candidatures"
          value="148"
          icon="groups"
          trend="+18% vs mois dernier"
          trendPositive={true}
          colorVariant="secondary"
        />
        <KpiCard
          title="Entretiens planifiés"
          value="8"
          icon="event_available"
          trend="3 cette semaine"
          trendPositive={true}
          colorVariant="primary"
        />
        <KpiCard
          title="Taux de conversion"
          value="18%"
          icon="trending_up"
          trend="+4% qualité profil"
          trendPositive={true}
          colorVariant="secondary"
        />
      </div>

      {/* Recent Applications Table Section */}
      <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Candidatures récentes reçues</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Profils de candidats togolais ayant récemment postulé à vos annonces.
            </p>
          </div>
          <Link
            to="/recruteur/candidatures"
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
          >
            Voir tout le pipeline <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/20 text-on-surface-variant font-bold uppercase tracking-wider">
                <th className="pb-3">Candidat</th>
                <th className="pb-3">Poste visé</th>
                <th className="pb-3">Score IA</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {recentApplications.map((app) => (
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
                        <span className="text-[10px] text-on-surface-variant">{app.candidatePhone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-on-surface">
                    {app.jobTitle}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-bold text-[11px]">
                      {app.matchScore || 90}%
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-on-surface-variant">
                    {app.appliedDate}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                        app.status === 'Entretien'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : app.status === 'En revue'
                          ? 'bg-primary-fixed text-primary'
                          : app.status === 'Retenu'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-surface-variant text-on-surface-variant'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleOpenCandidate(app)}
                      className="px-3 py-1 bg-surface-variant text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Évaluer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Active Jobs Overview Section */}
      <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Vos offres en cours de diffusion</h2>
          <Link
            to="/recruteur/offres"
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
          >
            Gérer toutes les offres ({jobs.length}) <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {jobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              onClick={() => navigate('/recruteur/offres')}
              className="p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 hover:shadow-soft transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-primary">{job.title}</h4>
                <p className="text-xs text-on-surface-variant">
                  {job.location} • {job.contractType}
                </p>
                <span className="text-[11px] text-secondary font-semibold mt-1 block">
                  {applicantsCountByJob[job.id] || 0} candidatures reçues
                </span>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          ))}
        </div>
      </section>

      {/* Candidate Detail Modal */}
      <CandidateModal
        application={selectedApplication}
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
      />
    </div>
  );
};
