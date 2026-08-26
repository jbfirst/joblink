import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { JobCard } from '../../components/jobs/JobCard';
import { EmptyState } from '../../components/common/EmptyState';

export const CompanyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { companies, jobs } = useJob();

  const company = companies.find((c) => c.id === id) || companies[0];
  const companyJobs = jobs.filter((j) => j.companyId === company?.id || j.company === company?.name);

  if (!company) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-16">
        <EmptyState
          title="Entreprise non trouvée"
          description="Cette entreprise n'existe pas ou n'a pas encore configuré son profil public."
        />
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <section className="bg-surface-container-lowest rounded-3xl shadow-soft border border-outline-variant/30 overflow-hidden relative">
        <div className="h-44 sm:h-64 w-full relative overflow-hidden">
          <img
            src={company.banner}
            alt={company.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="px-6 md:px-10 pb-8 pt-16 relative">
          {/* Logo */}
          <div className="absolute -top-16 left-6 md:left-10 w-28 h-28 bg-white rounded-2xl shadow-lift border-4 border-white p-1 overflow-hidden">
            <img
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">{company.name}</h1>
                <span className="material-symbols-outlined text-secondary text-[22px]" title="Entreprise certifiée">
                  verified
                </span>
              </div>
              <p className="text-sm text-on-surface-variant font-medium max-w-xl">
                {company.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-surface-variant/40 hover:bg-surface-variant text-xs font-bold text-primary transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">language</span>
                Site Web officiel
              </a>
              <Link
                to="/recruteur/publier-offre"
                className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-colors"
              >
                Espace Recruteur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Left Info & Right Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: About, Values, Specs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Specs Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-primary border-b border-outline-variant/20 pb-3">
              Informations clés
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Secteur :</span>
                <span className="font-bold text-primary">{company.industry}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Taille :</span>
                <span className="font-bold text-primary">{company.size}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Fondation :</span>
                <span className="font-bold text-primary">{company.foundedYear}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Siège social :</span>
                <span className="font-bold text-primary text-right">{company.address}</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3">
            <h3 className="text-base font-bold text-primary">À propos de l'entreprise</h3>
            <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
              {company.about}
            </p>
          </div>

          {/* Values */}
          {company.values && (
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3">
              <h3 className="text-base font-bold text-primary">Nos Valeurs & Culture</h3>
              <div className="flex flex-wrap gap-2">
                {company.values.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-secondary-container/20 border border-secondary/20 text-xs font-semibold text-secondary"
                  >
                    ✓ {val}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Open Positions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">
              Offres d'emploi ouvertes ({companyJobs.length})
            </h2>
            <span className="text-xs text-on-surface-variant">Postulez directement</span>
          </div>

          {companyJobs.length === 0 ? (
            <EmptyState
              title="Aucune offre en cours"
              description={`${company.name} n'a pas d'offre d'emploi active pour le moment. Revenez bientôt !`}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companyJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
