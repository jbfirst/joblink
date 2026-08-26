import React from 'react';
import { Link } from 'react-router-dom';
import { Application, ApplicationStatus } from '../../types';
import { Badge } from '../common/Badge';

export interface ApplicationCardProps {
  application: Application;
  onWithdraw?: (id: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onWithdraw }) => {
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Nouveau':
        return <Badge variant="primary">Envoyée</Badge>;
      case 'En attente':
        return <Badge variant="info">En attente</Badge>;
      case 'En revue':
        return <Badge variant="info">En revue</Badge>;
      case 'Entretien':
        return <Badge variant="success">Entretien programmé</Badge>;
      case 'Retenu':
        return <Badge variant="success">Offre acceptée / Retenu</Badge>;
      case 'Refusé':
        return <Badge variant="error">Non retenu</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const steps: ApplicationStatus[] = ['Nouveau', 'En revue', 'Entretien', 'Retenu'];
  
  const getStepIndex = (status: ApplicationStatus) => {
    if (status === 'Nouveau' || status === 'En attente') return 0;
    if (status === 'En revue') return 1;
    if (status === 'Entretien') return 2;
    if (status === 'Retenu') return 3;
    return -1;
  };

  const currentStep = getStepIndex(application.status);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-soft hover:shadow-lift transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
        <div className="flex items-start gap-4">
          {application.companyLogo ? (
            <img
              src={application.companyLogo}
              alt={application.companyName}
              className="w-12 h-12 rounded-xl object-cover border border-outline-variant/30 p-0.5 bg-white shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-lg">
              {application.companyName.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-bold text-base text-primary">{application.jobTitle}</h3>
              {getStatusBadge(application.status)}
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              {application.companyName} • Postulé le {application.appliedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/offres/${application.jobId}`}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Voir l'offre</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
          {onWithdraw && application.status !== 'Retenu' && application.status !== 'Refusé' && (
            <button
              onClick={() => onWithdraw(application.id)}
              className="text-xs font-medium text-error hover:underline"
            >
              Retirer
            </button>
          )}
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      {application.status !== 'Refusé' ? (
        <div className="pt-5 pb-2">
          <div className="grid grid-cols-4 gap-2 relative">
            {steps.map((step, idx) => {
              const isCompleted = currentStep >= idx;
              const isCurrent = currentStep === idx;
              return (
                <div key={step} className="flex flex-col items-center text-center relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 z-10 ${
                      isCompleted
                        ? 'bg-secondary text-white ring-4 ring-secondary/15'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      isCurrent
                        ? 'text-primary font-bold'
                        : isCompleted
                        ? 'text-secondary'
                        : 'text-on-surface-variant/70'
                    }`}
                  >
                    {step === 'Nouveau' ? 'Envoyée' : step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-error-container/20 border border-error/20 rounded-xl text-xs text-on-error-container flex items-center gap-2">
          <span className="material-symbols-outlined text-error">info</span>
          <span>Votre profil n'a pas été retenu pour ce poste. Continuez à postuler à d'autres opportunités !</span>
        </div>
      )}

      {/* Interview alert if present */}
      {application.interviewDate && (
        <div className="mt-4 p-3.5 bg-secondary-container/20 border border-secondary/20 rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-[20px]">event_available</span>
          <div className="text-xs">
            <p className="font-bold text-secondary">Entretien programmé</p>
            <p className="text-on-surface-variant mt-0.5">{application.interviewDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};
