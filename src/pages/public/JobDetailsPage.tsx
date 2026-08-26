import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { JobApplyModal } from '../../components/jobs/JobApplyModal';
import { JobCard } from '../../components/jobs/JobCard';
import { EmptyState } from '../../components/common/EmptyState';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, companies, isJobSaved, toggleSaveJob } = useJob();
  const { showToast } = useToast();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const job = jobs.find((j) => j.id === id);
  const company = companies.find((c) => c.id === job?.companyId || c.name === job?.company);
  const saved = job ? isJobSaved(job.id) : false;

  if (!job) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-16">
        <EmptyState
          title="Offre introuvable"
          description="Cette offre d'emploi a peut-être expiré ou a été retirée par l'employeur."
          actionText="Retourner aux offres"
          onAction={() => navigate('/offres')}
        />
      </div>
    );
  }

  const relatedJobs = jobs.filter((j) => j.id !== job.id && (j.industry === job.industry || j.companyId === job.companyId)).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Lien copié', 'Le lien de l\'offre a été copié dans votre presse-papiers.', 'info');
  };

  const handleBookmark = () => {
    toggleSaveJob(job.id);
    if (!saved) {
      showToast('Offre enregistrée', 'Cette offre a été ajoutée à vos favoris.', 'info');
    } else {
      showToast('Offre retirée', 'Cette offre a été retirée de vos favoris.', 'info');
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* Navigation Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Retour aux résultats</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
            title="Partager"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full border transition-all ${
              saved
                ? 'bg-primary-fixed text-primary border-primary/30'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant border-outline-variant/30'
            }`}
            title={saved ? 'Enregistré' : 'Sauvegarder'}
          >
            <span className={`material-symbols-outlined text-[20px] ${saved ? 'filled' : ''}`}>
              {saved ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>
      </div>

      {/* Bento Header Hero (Fidèle à Stitch d_tails_de_l_offre/code.html) */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-soft border border-outline-variant/30 overflow-hidden relative">
        {/* Cover Splash */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-primary-container via-surface-tint to-primary w-full relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="px-6 md:px-8 pb-8 pt-16 relative">
          {/* Floating Company Logo */}
          <div className="absolute -top-12 left-6 md:left-8 w-24 h-24 bg-surface rounded-2xl shadow-md border-2 border-white flex items-center justify-center p-2 overflow-hidden">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
                {job.title}
              </h1>
              <p className="text-base text-on-surface-variant font-medium flex items-center gap-2 flex-wrap">
                <span className="font-bold text-primary">{job.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
                  {job.location}, Togo
                </span>
                <span>•</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
                  {job.industry}
                </span>
              </p>
            </div>

            {/* Badges and CTA in Header */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold border border-secondary/20">
                <span className="material-symbols-outlined text-[16px] mr-1">work</span>
                {job.contractType}
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-surface-variant text-on-surface-variant text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] mr-1">laptop_mac</span>
                {job.workMode}
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-surface-variant text-on-surface-variant text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                Publié le {job.postedDate}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout: 8 cols Details + 4 cols Sticky Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Descriptions & Details */}
        <div className="lg:col-span-8 space-y-10">
          {/* Description */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">description</span>
              Description du poste
            </h2>
            <p className="text-sm md:text-base text-on-surface leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </section>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">checklist</span>
                Missions & Responsabilités clés
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements (Bento Cards Grid) */}
          {job.requirements && job.requirements.length > 0 && (
            <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">stars</span>
                Profil recherché & Compétences requises
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-surface-variant/20 border border-outline-variant/20 flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                      verified
                    </span>
                    <span className="text-xs md:text-sm text-on-surface font-medium">{req}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Benefits & Advantages */}
          {job.benefits && job.benefits.length > 0 && (
            <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">card_giftcard</span>
                Avantages offerts par l'entreprise
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((ben, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-secondary-container/15 border border-secondary/20 flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                      sentiment_satisfied
                    </span>
                    <span className="text-xs md:text-sm text-on-surface font-medium">{ben}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Jobs */}
          {relatedJobs.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-primary">Offres similaires qui pourraient vous intéresser</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedJobs.map((rj) => (
                  <JobCard key={rj.id} job={rj} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Sticky Application Box & Company Card */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Quick Apply Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-drawer space-y-5">
            {job.salaryMin && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Salaire indicatif
                </span>
                <p className="text-2xl font-extrabold text-secondary mt-1">
                  {job.salaryMin.toLocaleString('fr-FR')} - {job.salaryMax?.toLocaleString('fr-FR')} {job.currency}
                </p>
                <span className="text-[11px] text-on-surface-variant font-medium">Par {job.salaryPeriod} • Négociable selon profil</span>
              </div>
            )}

            <div className="space-y-2 pt-3 border-t border-outline-variant/20 text-xs text-on-surface-variant">
              <div className="flex justify-between py-1">
                <span>Date limite :</span>
                <span className="font-bold text-primary">{job.deadline}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Candidats inscrits :</span>
                <span className="font-bold text-secondary">{job.applicantsCount || 0} personnes</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Localisation :</span>
                <span className="font-bold text-primary">{job.location}, Togo</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-md"
              onClick={() => setIsApplyModalOpen(true)}
              leftIcon={<span className="material-symbols-outlined text-[20px]">send</span>}
            >
              Postuler maintenant
            </Button>

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={handleBookmark}
              leftIcon={
                <span className={`material-symbols-outlined text-[18px] ${saved ? 'filled text-primary' : ''}`}>
                  {saved ? 'bookmark' : 'bookmark_border'}
                </span>
              }
            >
              {saved ? 'Enregistré dans vos favoris' : 'Sauvegarder cette offre'}
            </Button>
          </div>

          {/* Company Mini Profile Card */}
          {company && (
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-12 h-12 rounded-xl object-cover border border-outline-variant/30 p-0.5 bg-white"
                />
                <div>
                  <h4 className="font-bold text-sm text-primary">{company.name}</h4>
                  <p className="text-xs text-on-surface-variant">{company.size}</p>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                {company.about}
              </p>

              <div className="pt-2 border-t border-outline-variant/20">
                <Link
                  to={`/entreprises/${company.id}`}
                  className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                >
                  <span>Découvrir l'entreprise</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      <JobApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
