import React from 'react';
import { Application } from '../../types';

export interface CandidatePipelineCardProps {
  application: Application;
  onClick: () => void;
}

export const CandidatePipelineCard: React.FC<CandidatePipelineCardProps> = ({
  application,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-soft hover:shadow-lift hover:border-primary/30 transition-all cursor-pointer flex flex-col gap-3 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {application.candidateAvatar ? (
            <img
              src={application.candidateAvatar}
              alt={application.candidateName}
              className="w-9 h-9 rounded-full object-cover border border-outline-variant/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
              {application.candidateName.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="font-bold text-xs text-primary group-hover:text-secondary transition-colors">
              {application.candidateName}
            </h4>
            <p className="text-[11px] text-on-surface-variant line-clamp-1">
              {application.candidateTitle}
            </p>
          </div>
        </div>

        {application.matchScore && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container border border-secondary/20">
            {application.matchScore}%
          </span>
        )}
      </div>

      <div className="text-[11px] text-on-surface-variant/80 bg-surface-variant/30 px-2.5 py-1.5 rounded-lg line-clamp-1">
        Poste : <strong className="text-primary">{application.jobTitle}</strong>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[10px] text-on-surface-variant">
        <span>Postulé le {application.appliedDate}</span>
        <span className="text-secondary font-semibold group-hover:underline flex items-center gap-0.5">
          Évaluer <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        </span>
      </div>
    </div>
  );
};
