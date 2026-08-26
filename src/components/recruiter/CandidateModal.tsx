import React, { useState } from 'react';
import { Application, ApplicationStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useJob } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';

export interface CandidateModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  application,
  isOpen,
  onClose
}) => {
  const { updateApplicationStatus } = useJob();
  const { showToast } = useToast();

  const [notes, setNotes] = useState(application?.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!application) return null;

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(application.id, newStatus);
      showToast(
        'Statut mis à jour',
        `La candidature de ${application.candidateName} est passée à "${newStatus}".`,
        'success'
      );
      onClose();
    } catch (error) {
      showToast('Erreur', 'Impossible de mettre à jour le statut. Réessayez.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails du candidat"
      description={`Candidature pour : ${application.jobTitle}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Candidate Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <div className="flex items-center gap-3.5">
            <img
              src={application.candidateAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
              alt={application.candidateName}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="text-base font-bold text-primary">{application.candidateName}</h3>
              <p className="text-xs text-on-surface-variant">{application.candidateTitle}</p>
              <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  {application.candidateEmail}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">phone</span>
                  {application.candidatePhone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-2">
            <Badge variant="primary" size="md">
              Score IA : {application.matchScore}%
            </Badge>
            <span className="text-[11px] text-on-surface-variant">
              Postulé le {application.appliedDate}
            </span>
          </div>
        </div>

        {/* Motivation / Cover letter */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">format_quote</span>
            Lettre / Message de motivation
          </h4>
          <div className="p-4 bg-surface-variant/20 rounded-xl text-xs text-on-surface leading-relaxed border border-outline-variant/20">
            {application.coverLetter || 'Aucun message de motivation renseigné.'}
          </div>
        </div>

        {/* CV Attachment Box */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">description</span>
            Curriculum Vitae
          </h4>
          <div className="flex items-center justify-between p-3.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
                PDF
              </div>
              <div>
                <p className="text-xs font-bold text-primary">{application.resumeName || 'CV_Candidat.pdf'}</p>
                <p className="text-[10px] text-on-surface-variant">Document PDF • 1.4 Mo</p>
              </div>
            </div>
            <button
              onClick={() => showToast('Téléchargement simulé', `Téléchargement de ${application.resumeName || 'CV.pdf'}`, 'info')}
              className="px-3 py-1.5 rounded-lg bg-surface-variant text-primary text-xs font-semibold hover:bg-surface-variant/80 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Télécharger
            </button>
          </div>
        </div>

        {/* Recruiter Notes */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">edit_note</span>
            Notes internes du recruteur
          </h4>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ajouter une observation ou une évaluation suite à l'entretien..."
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Pipeline Decision Actions */}
        <div className="pt-4 border-t border-outline-variant/20 flex flex-col gap-3">
          <label className="text-xs font-bold text-primary">Déplacer dans le pipeline :</label>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={application.status === 'Nouveau' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('Nouveau')}
              disabled={isUpdating}
            >
              Nouveau
            </Button>
            <Button
              variant={application.status === 'En revue' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('En revue')}
              disabled={isUpdating}
            >
              En revue
            </Button>
            <Button
              variant={application.status === 'Entretien' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('Entretien')}
              disabled={isUpdating}
              leftIcon={<span className="material-symbols-outlined text-[14px]">event</span>}
            >
              Planifier entretien
            </Button>
            <Button
              variant={application.status === 'Retenu' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('Retenu')}
              disabled={isUpdating}
              leftIcon={<span className="material-symbols-outlined text-[14px]">check_circle</span>}
            >
              Retenir le candidat
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleStatusChange('Refusé')}
              disabled={isUpdating}
              className="ml-auto"
            >
              Refuser
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
