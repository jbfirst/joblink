import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import { Badge } from '../common/Badge';
import { useJob } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';

export interface JobCardProps {
  job: Job;
  variant?: 'grid' | 'list';
}

export const JobCard: React.FC<JobCardProps> = ({ job, variant = 'grid' }) => {
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob } = useJob();
  const { showToast } = useToast();
  const saved = isJobSaved(job.id);

  const handleCardClick = () => {
    navigate(`/offres/${job.id}`);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveJob(job.id);
    if (!saved) {
      showToast('Offre enregistrée', `L'offre "${job.title}" a été ajoutée à vos favoris.`, 'info');
    } else {
      showToast('Offre retirée', `L'offre a été retirée de vos favoris.`, 'info');
    }
  };

  const getStatusBadge = () => {
    switch (job.status) {
      case 'Ouvert':
        return <Badge variant="success">Ouvert</Badge>;
      case 'Clôture bientôt':
        return <Badge variant="warning">Clôture bientôt</Badge>;
      case 'Nouveau':
        return <Badge variant="primary">Nouveau</Badge>;
      case 'Clôturé':
        return <Badge variant="neutral">Clôturé</Badge>;
      default:
        return null;
    }
  };

  if (variant === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-soft hover:shadow-lift hover:border-primary/25 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
      >
        <div className="flex items-start gap-4">
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-12 h-12 rounded-xl object-cover border border-outline-variant/30 p-0.5 bg-white shrink-0 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-on-surface-variant flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-primary">{job.company}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                {job.location}
              </span>
              {job.salaryMin && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-secondary">
                    {job.salaryMin.toLocaleString('fr-FR')} - {job.salaryMax?.toLocaleString('fr-FR')} {job.currency}/{job.salaryPeriod}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#EDF2F7] text-on-surface-variant text-xs font-semibold px-3 py-1 rounded-full">
              {job.contractType}
            </span>
            <span className="bg-[#EDF2F7] text-on-surface-variant text-xs font-semibold px-3 py-1 rounded-full">
              {job.workMode}
            </span>
          </div>
          <button
            onClick={handleBookmarkClick}
            className={`p-2 rounded-full border transition-all ${
              saved
                ? 'bg-primary-fixed text-primary border-primary/30'
                : 'text-outline hover:text-primary hover:bg-surface-variant/50 border-outline-variant/30'
            }`}
            title={saved ? 'Retirer des favoris' : 'Enregistrer'}
          >
            <span className={`material-symbols-outlined text-[20px] ${saved ? 'filled' : ''}`}>
              {saved ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Default Grid Variant
  return (
    <div
      onClick={handleCardClick}
      className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-soft hover:shadow-lift hover:border-primary/25 transition-all duration-200 flex flex-col justify-between gap-5 cursor-pointer group h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant/30 p-0.5">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-full transition-all ${
                saved
                  ? 'text-primary'
                  : 'text-outline hover:text-primary hover:bg-surface-variant/50'
              }`}
              title={saved ? 'Retirer des favoris' : 'Enregistrer'}
            >
              <span className={`material-symbols-outlined text-[20px] ${saved ? 'filled' : ''}`}>
                {saved ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {job.title}
          </h3>
          <p className="text-sm text-on-surface-variant font-medium">
            {job.company} • {job.location}
          </p>
        </div>

        {job.salaryMin && (
          <div className="mt-3">
            <span className="text-xs font-bold text-secondary">
              {job.salaryMin.toLocaleString('fr-FR')} - {job.salaryMax?.toLocaleString('fr-FR')} {job.currency}/{job.salaryPeriod}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-outline-variant/20">
        <span className="bg-[#EDF2F7] text-on-surface-variant text-xs font-semibold px-3 py-1 rounded-full">
          {job.contractType}
        </span>
        <span className="bg-[#EDF2F7] text-on-surface-variant text-xs font-semibold px-3 py-1 rounded-full">
          {job.workMode}
        </span>
        <span className="text-[11px] text-on-surface-variant/70 ml-auto flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {job.postedDate}
        </span>
      </div>
    </div>
  );
};
