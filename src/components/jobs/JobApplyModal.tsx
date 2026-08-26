import React, { useState } from 'react';
import { Job } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useJob } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';

export interface JobApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export const JobApplyModal: React.FC<JobApplyModalProps> = ({ job, isOpen, onClose }) => {
  const { candidateProfile, addApplication } = useJob();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  const [fullName, setFullName] = useState(candidateProfile.fullName);
  const [email, setEmail] = useState(candidateProfile.email);
  const [phone, setPhone] = useState(candidateProfile.phone);
  const [coverLetter, setCoverLetter] = useState(
    `Madame, Monsieur,\n\nVivement intéressé(e) par le poste de ${job.title} au sein de ${job.company}, je souhaite vous soumettre ma candidature.\n\nRestant à votre disposition pour un entretien.`
  );
  const [resumeFile, setResumeFile] = useState<string>(candidateProfile.resumeName || 'CV_Koffi_Mensah.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addApplication(job.id, coverLetter, resumeFile);
      showToast(
        'Candidature envoyée avec succès !',
        `Votre candidature pour "${job.title}" a été transmise à ${job.company}.`,
        'success'
      );
      addNotification({
        title: 'Candidature transmise',
        message: `Votre candidature pour le poste "${job.title}" chez ${job.company} a bien été enregistrée.`,
        type: 'application',
        link: '/candidat/candidatures'
      });
      onClose();
    } catch (error) {
      console.error('Erreur envoi candidature :', error);
      showToast(
        'Erreur',
        'Impossible d\'envoyer votre candidature. Réessayez.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Postuler à l'offre"
      description={`${job.title} • ${job.company}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Summary Banner */}
        <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex items-center gap-3">
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-10 h-10 rounded-lg object-cover bg-white p-0.5 border border-outline-variant/20"
          />
          <div>
            <h4 className="font-bold text-xs text-primary">{job.title}</h4>
            <p className="text-[11px] text-on-surface-variant">
              {job.location} • {job.contractType} • {job.workMode}
            </p>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Numéro de téléphone (Togo)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            leftIcon={<span className="text-xs font-bold text-primary">🇹🇬</span>}
          />
        </div>

        <Input
          label="Adresse Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* CV Selection */}
        <div>
          <label className="text-xs font-semibold text-primary block mb-1.5">
            Curriculum Vitae (CV)
          </label>
          <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-4 text-center bg-surface-variant/20 hover:bg-surface-variant/40 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-3xl text-primary mb-1">upload_file</span>
            <p className="text-xs font-bold text-primary">{resumeFile}</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Glissez-déposez un nouveau fichier PDF ou DOCX (Max 5 Mo)
            </p>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              className="hidden"
              id="cv-upload-input"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setResumeFile(e.target.files[0].name);
                }
              }}
            />
            <label
              htmlFor="cv-upload-input"
              className="mt-2 inline-block px-3 py-1 bg-surface-container-lowest text-primary text-xs font-semibold rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-variant"
            >
              Changer de fichier
            </label>
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="text-xs font-semibold text-primary block mb-1.5">
            Message de motivation (optionnel)
          </label>
          <textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            placeholder="Présentez brièvement vos atouts pour ce poste..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
          <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<span className="material-symbols-outlined text-sm">send</span>}
          >
            Confirmer ma candidature
          </Button>
        </div>
      </form>
    </Modal>
  );
};
