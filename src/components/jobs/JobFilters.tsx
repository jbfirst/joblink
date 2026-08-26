import React from 'react';
import { useJob } from '../../context/JobContext';
import { Button } from '../common/Button';

export const industries = [
  'Toutes les industries',
  'Informatique & Technologies',
  'Banque & Finance',
  'Logistique & Transport',
  'BTP & Construction',
  'Agro-industrie'
];

export const contractTypes = ['Tous', 'CDI', 'CDD', 'Stage', 'Freelance'];
export const workModes = ['Tous', 'Présentiel', 'Hybride', 'Télétravail'];
export const locations = ['Toutes les localités', 'Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé'];

export const JobFilters: React.FC<{ isMobileDrawer?: boolean; onCloseMobile?: () => void }> = ({
  isMobileDrawer = false,
  onCloseMobile
}) => {
  const {
    filters,
    setFilters,
    resetFilters
  } = useJob();

  const handleIndustryChange = (ind: string) => {
    setFilters((prev) => ({
      ...prev,
      industry: ind === 'Toutes les industries' ? '' : ind
    }));
  };

  const handleContractChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      contractType: type === 'Tous' ? '' : type
    }));
  };

  const handleWorkModeChange = (mode: string) => {
    setFilters((prev) => ({
      ...prev,
      workMode: mode === 'Tous' ? '' : mode
    }));
  };

  const handleLocationChange = (loc: string) => {
    setFilters((prev) => ({
      ...prev,
      location: loc === 'Toutes les localités' ? '' : loc
    }));
  };

  return (
    <div className={`bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-soft p-6 flex flex-col gap-6 ${isMobileDrawer ? 'border-none shadow-none p-0' : ''}`}>
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <h3 className="font-bold text-lg text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">tune</span>
          Filtres de recherche
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-secondary hover:underline"
        >
          Réinitialiser
        </button>
      </div>

      {/* Localisation Togo */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
          Localisation au Togo
        </label>
        <div className="flex flex-wrap gap-2">
          {locations.map((loc) => {
            const isSelected = (filters.location === '' && loc === 'Toutes les localités') || filters.location === loc;
            return (
              <button
                key={loc}
                onClick={() => handleLocationChange(loc)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-[#EDF2F7] text-on-surface hover:bg-surface-variant'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secteur d'activité */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
          Secteur d'activité
        </label>
        <div className="flex flex-col gap-1.5">
          {industries.map((ind) => {
            const isSelected = (filters.industry === '' && ind === 'Toutes les industries') || filters.industry === ind;
            return (
              <button
                key={ind}
                onClick={() => handleIndustryChange(ind)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-primary-fixed text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-variant/40'
                }`}
              >
                <span>{ind}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type de contrat */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
          Type de contrat
        </label>
        <div className="flex flex-wrap gap-2">
          {contractTypes.map((type) => {
            const isSelected = (filters.contractType === '' && type === 'Tous') || filters.contractType === type;
            return (
              <button
                key={type}
                onClick={() => handleContractChange(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-[#EDF2F7] text-on-surface hover:bg-surface-variant'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode de travail */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
          Modalité de travail
        </label>
        <div className="flex flex-wrap gap-2">
          {workModes.map((mode) => {
            const isSelected = (filters.workMode === '' && mode === 'Tous') || filters.workMode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleWorkModeChange(mode)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-[#EDF2F7] text-on-surface hover:bg-surface-variant'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {isMobileDrawer && onCloseMobile && (
        <div className="pt-4">
          <Button variant="primary" className="w-full" onClick={onCloseMobile}>
            Appliquer les filtres
          </Button>
        </div>
      )}
    </div>
  );
};
