import React, { useState, useMemo } from 'react';
import { useJob } from '../../context/JobContext';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilters } from '../../components/jobs/JobFilters';
import { JobCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const JobListingsPage: React.FC = () => {
  const {
    jobs,
    filters,
    setFilters,
    resetFilters,
    isLoadingSimulation,
    isErrorSimulation,
    setIsErrorSimulation
  } = useJob();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'salary' | 'title'>('recent');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and Sort Logic
  const filteredJobs = useMemo(() => {

    let list = jobs.filter((job) => {
      // Query filter
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesDesc = job.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesDesc) return false;
      }

      // Location filter
      if (filters.location && filters.location !== 'Toutes les localités') {
        if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Industry filter
      if (filters.industry && filters.industry !== 'Toutes les industries') {
        if (job.industry !== filters.industry) return false;
      }

      // Contract Type
      if (filters.contractType && filters.contractType !== 'Tous') {
        if (job.contractType !== filters.contractType) return false;
      }

      // Work mode
      if (filters.workMode && filters.workMode !== 'Tous') {
        if (job.workMode !== filters.workMode) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'salary') {
      list = [...list].sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (sortBy === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // recent
      list = [...list].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }

    return list;
  }, [jobs, filters, sortBy]);

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Top Search Hero Header (Fidèle à Stitch recherche_d_emplois/code.html) */}
      <section className="bg-white rounded-2xl shadow-soft p-6 md:p-8 border border-outline-variant/30">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 tracking-tight">
          Trouvez votre prochaine opportunité au Togo
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant mb-6">
          Découvrez {jobs.length} offres vérifiées d'entreprises togolaises et internationales.
        </p>

        {/* Search & Location inputs */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              type="text"
              placeholder="Titre de poste, mot-clé, compétence ou entreprise..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/60 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-inner text-sm text-on-surface placeholder:text-outline/60"
            />
          </div>

          <div className="relative flex-1 md:max-w-xs">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">
              location_on
            </span>
            <select
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full pl-11 pr-8 py-3 rounded-xl border border-outline-variant/60 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-inner text-sm text-on-surface appearance-none"
            >
              <option value="">Toutes les villes du Togo</option>
              <option value="Lomé">Lomé (Maritime)</option>
              <option value="Kara">Kara (Nord)</option>
              <option value="Sokodé">Sokodé (Centrale)</option>
              <option value="Atakpamé">Atakpamé (Plateaux)</option>
              <option value="Kpalimé">Kpalimé (Kloto)</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
              expand_more
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="shrink-0"
            onClick={() => {}}
          >
            Rechercher
          </Button>
        </div>

        {/* Quick Industry Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-outline-variant/20">
          {[
            'Toutes les industries',
            'Informatique & Technologies',
            'Banque & Finance',
            'Logistique & Transport',
            'BTP & Construction',
            'Agro-industrie'
          ].map((ind) => {
            const isSelected = (filters.industry === '' && ind === 'Toutes les industries') || filters.industry === ind;
            return (
              <button
                key={ind}
                onClick={() => setFilters((prev) => ({ ...prev, industry: ind === 'Toutes les industries' ? '' : ind }))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-[#EDF2F7] text-on-surface hover:bg-surface-variant'
                }`}
              >
                {ind}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Left Filters Sidebar + Right Jobs Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <JobFilters />
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="w-full flex justify-center items-center gap-2"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <span className="material-symbols-outlined">tune</span>
            Afficher les filtres ({[filters.location, filters.industry, filters.contractType, filters.workMode].filter(Boolean).length})
          </Button>
        </div>

        {/* Mobile Filters Modal */}
        <Modal
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filtres de recherche"
          maxWidth="md"
        >
          <JobFilters isMobileDrawer onCloseMobile={() => setIsMobileFilterOpen(false)} />
        </Modal>

        {/* Right Listings Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Bar: Results Count, View Mode & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-soft">
            <div className="text-sm font-semibold text-primary flex items-center gap-2">
              <span>{filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} disponible{filteredJobs.length > 1 ? 's' : ''}</span>
              {(filters.searchQuery || filters.location || filters.industry || filters.contractType) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-secondary font-bold hover:underline"
                >
                  (Effacer filtres)
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-on-surface-variant font-medium">Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-surface rounded-lg border border-outline-variant/60 py-1.5 px-2.5 text-xs font-semibold text-primary focus:outline-none"
                >
                  <option value="recent">Plus récentes</option>
                  <option value="salary">Salaire le plus élevé</option>
                  <option value="title">Intitulé de poste (A-Z)</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center bg-surface-variant/40 p-1 rounded-lg border border-outline-variant/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                  title="Vue Grille"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                  title="Vue Liste"
                >
                  <span className="material-symbols-outlined text-[18px]">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error State Simulation */}
          {isErrorSimulation ? (
            <ErrorState
              title="Erreur lors du chargement des offres"
              message="Un problème réseau temporaire est survenu. Veuillez réessayer."
              onRetry={() => setIsErrorSimulation(false)}
            />
          ) : isLoadingSimulation ? (
            /* Loading State Skeletons */
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : filteredJobs.length === 0 ? (
            /* Empty State */
            <EmptyState
              title="Aucune offre trouvée"
              description="Aucune offre ne correspond à vos critères de recherche actuels. Essayez d'élargir vos filtres ou de modifier votre localisation."
              actionText="Réinitialiser tous les filtres"
              onAction={resetFilters}
            />
          ) : (
            /* Real Results Grid / List */
            <div
              className={`grid gap-5 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} variant={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
