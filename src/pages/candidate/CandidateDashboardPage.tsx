import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { KpiCard } from '../../components/recruiter/KpiCard';
import { ApplicationCard } from '../../components/candidate/ApplicationCard';
import { JobCard } from '../../components/jobs/JobCard';
import { Button } from '../../components/common/Button';

export const CandidateDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { candidateProfile, applications, jobs, savedJobIds } = useJob();

  const userApplications = applications.filter((app) => app.candidateId === candidateProfile.id || app.candidateName === candidateProfile.fullName);
  const interviewingCount = userApplications.filter((app) => app.status === 'Entretien').length;
  const recentApplications = userApplications.slice(0, 2);
  const recommendedJobs = jobs.filter((j) => j.industry === 'Informatique & Technologies' || j.location === 'Lomé').slice(0, 3);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome Banner (Fidèle à Stitch tableau_de_bord_candidat) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">
            Bon retour, {candidateProfile.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-on-surface-variant">
            Voici l'aperçu de votre activité et des opportunités professionnelles aujourd'hui.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/offres')}
          leftIcon={<span className="material-symbols-outlined text-[18px]">search</span>}
        >
          Trouver des offres
        </Button>
      </div>

      {/* KPI Stats Grid (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Candidatures envoyées"
          value={userApplications.length || 24}
          icon="assignment_turned_in"
          trend="+3 cette semaine"
          trendPositive={true}
          colorVariant="primary"
        />
        <KpiCard
          title="Entretiens en cours"
          value={interviewingCount || 3}
          icon="forum"
          trend="1 entretien prévu"
          trendPositive={true}
          colorVariant="secondary"
        />
        <KpiCard
          title="Vues du profil"
          value="156"
          icon="visibility"
          trend="+12% ce mois"
          trendPositive={true}
          colorVariant="primary"
        />
        <KpiCard
          title="Offres enregistrées"
          value={savedJobIds.length}
          icon="bookmark"
          trend="À consulter"
          trendPositive={true}
          colorVariant="secondary"
        />
      </div>

      {/* Profile Completeness Alert Bar */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Complétion de votre profil : 85%
            </span>
            <span className="text-xs font-bold text-secondary">Très bon profil</span>
          </div>
          <div className="w-full bg-surface-variant/40 h-2.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full transition-all duration-500 w-[85%]" />
          </div>
          <p className="text-xs text-on-surface-variant">
            Astuce : Ajoutez une certification ou une vidéo de présentation pour atteindre 100% et être contacté(e) 2x plus rapidement par les recruteurs à Lomé.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/candidat/profil')}
          className="shrink-0"
        >
          Compléter mon profil
        </Button>
      </div>

      {/* Recent Applications Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Candidatures en cours</h2>
          <Link
            to="/candidat/candidatures"
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
          >
            Tout voir ({userApplications.length}) <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="space-y-4">
          {recentApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      </section>

      {/* Recommended Jobs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Offres recommandées pour votre profil</h2>
          <Link
            to="/offres"
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
          >
            Explorer tout <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
};
