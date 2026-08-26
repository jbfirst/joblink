import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { JobCard } from '../../components/jobs/JobCard';
import { ContractType, WorkMode, Job } from '../../types';

export const EditJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, updateJob } = useJob();
  const { user } = useAuth();
  const { showToast } = useToast();

  const existingJob = jobs.find((j) => j.id === jobId);
  const isOwner = !existingJob || !user ? false : existingJob.ownerId === user.id;

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Lomé');
  const [industry, setIndustry] = useState('Informatique & Technologies');
  const [contractType, setContractType] = useState<ContractType>('CDI');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybride');
  const [experienceLevel, setExperienceLevel] = useState('Intermédiaire (2-5 ans)');
  const [salaryMin, setSalaryMin] = useState<number>(0);
  const [salaryMax, setSalaryMax] = useState<number>(0);
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResp, setNewResp] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newReq, setNewReq] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBen, setNewBen] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Pré-remplir le formulaire dès que l'offre est trouvée dans le contexte
  useEffect(() => {
    if (existingJob) {
      setTitle(existingJob.title);
      setCompany(existingJob.company);
      setLocation(existingJob.location);
      setIndustry(existingJob.industry);
      setContractType(existingJob.contractType);
      setWorkMode(existingJob.workMode);
      setExperienceLevel(existingJob.experienceLevel);
      setSalaryMin(existingJob.salaryMin || 0);
      setSalaryMax(existingJob.salaryMax || 0);
      setDeadline(existingJob.deadline);
      setDescription(existingJob.description);
      setResponsibilities(existingJob.responsibilities || []);
      setRequirements(existingJob.requirements || []);
      setBenefits(existingJob.benefits || []);
    } else if (jobs.length > 0) {
      // Les offres sont chargées mais celle-ci n'existe pas
      setNotFound(true);
    }
  }, [existingJob, jobs.length]);

  const previewJob: Job = {
    id: jobId || 'preview-temp',
    title: title || 'Intitulé du poste d\'exemple',
    company,
    companyId: existingJob?.companyId || 'comp-1',
    companyLogo: existingJob?.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    location,
    workMode,
    contractType,
    industry,
    experienceLevel,
    salaryMin,
    salaryMax,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: existingJob?.status || 'Nouveau',
    postedDate: existingJob?.postedDate || 'Aujourd\'hui',
    deadline,
    description: description || 'Description du poste en cours de rédaction...',
    responsibilities,
    requirements,
    benefits,
    applicantsCount: existingJob?.applicantsCount || 0,
    viewsCount: existingJob?.viewsCount || 1
  };

  const handleAddResp = () => {
    if (newResp.trim()) {
      setResponsibilities([...responsibilities, newResp.trim()]);
      setNewResp('');
    }
  };

  const handleAddReq = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq('');
    }
  };

  const handleAddBen = () => {
    if (newBen.trim()) {
      setBenefits([...benefits, newBen.trim()]);
      setNewBen('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !jobId) {
      showToast('Formulaire incomplet', 'Veuillez renseigner au moins le titre et la description.', 'warning');
      return;
    }
    setIsSubmitting(true);

    try {
      await updateJob(jobId, {
        title,
        company,
        location,
        workMode,
        contractType,
        industry,
        experienceLevel,
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        salaryPeriod: 'mois',
        currency: 'FCFA',
        deadline,
        description,
        responsibilities,
        requirements,
        benefits
      });

      showToast(
        'Offre mise à jour avec succès !',
        `L'annonce "${title}" a bien été modifiée.`,
        'success'
      );
      navigate('/recruteur/offres');
    } catch (error) {
      console.error('Erreur mise à jour offre:', error);
      showToast(
        'Erreur lors de la mise à jour',
        'Une erreur est survenue lors de l\'enregistrement des modifications. Réessayez.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="max-w-4xl space-y-4">
        <h1 className="text-2xl font-extrabold text-primary">Offre introuvable</h1>
        <p className="text-sm text-on-surface-variant">
          Cette offre n'existe pas ou a été supprimée.
        </p>
        <Button variant="primary" onClick={() => navigate('/recruteur/offres')}>
          Retour à mes offres
        </Button>
      </div>
    );
  }

  if (!existingJob) {
    return (
      <div className="max-w-4xl space-y-4">
        <p className="text-sm text-on-surface-variant">Chargement de l'offre...</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-4xl space-y-4">
        <h1 className="text-2xl font-extrabold text-primary">Accès refusé</h1>
        <p className="text-sm text-on-surface-variant">
          Vous ne pouvez modifier que les offres que vous avez vous-même publiées.
        </p>
        <Button variant="primary" onClick={() => navigate('/recruteur/offres')}>
          Retour à mes offres
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Modifier l'offre d'emploi</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Mettez à jour les détails du poste "{existingJob.title}".
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            leftIcon={<span className="material-symbols-outlined text-[18px]">{isPreviewMode ? 'edit' : 'visibility'}</span>}
          >
            {isPreviewMode ? 'Retourner à l\'édition' : 'Aperçu en direct'}
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        <div className="space-y-6">
          <div className="p-4 bg-secondary-container/20 border border-secondary/30 rounded-xl text-xs text-secondary font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            Voici comment l'offre apparaîtra dans les résultats de recherche :
          </div>
          <div className="max-w-md">
            <JobCard job={previewJob} />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-5">
            <h2 className="text-lg font-bold text-primary border-b border-outline-variant/20 pb-3">
              Informations générales
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Intitulé du poste"
                placeholder="Ex: Développeur React & TypeScript Senior"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Input
                label="Entreprise / Organisation"
                placeholder="Ex: TechHub Lomé"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Secteur / Industrie"
                options={[
                  'Informatique & Technologies',
                  'Banque & Finance',
                  'Logistique & Transport',
                  'BTP & Construction',
                  'Agro-industrie',
                  'Santé & Médical'
                ]}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />

              <Select
                label="Localisation au Togo"
                options={['Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé', 'Dapaong']}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Type de contrat"
                options={['CDI', 'CDD', 'Stage', 'Freelance']}
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
              />

              <Select
                label="Modalité de travail"
                options={['Présentiel', 'Hybride', 'Télétravail']}
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
              />

              <Select
                label="Niveau d'expérience visé"
                options={[
                  'Débutant (0-2 ans)',
                  'Intermédiaire (2-5 ans)',
                  'Senior (5+ ans)',
                  'Lead / Direction'
                ]}
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <Input
                label="Salaire minimum (FCFA/mois)"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
              />

              <Input
                label="Salaire maximum (FCFA/mois)"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
              />

              <Input
                label="Date limite de candidature"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </section>

          {/* Description */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
            <h2 className="text-lg font-bold text-primary border-b border-outline-variant/20 pb-3">
              Description du poste
            </h2>
            <textarea
              rows={6}
              placeholder="Présentez les enjeux du poste, le contexte de l'entreprise et les défis stimulants à relever..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </section>

          {/* Responsibilities & Requirements Lists */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-6">
            <h2 className="text-lg font-bold text-primary border-b border-outline-variant/20 pb-3">
              Responsabilités & Critères
            </h2>

            {/* Responsibilities */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-primary block">
                Missions & Responsabilités principales
              </label>
              <div className="space-y-2">
                {responsibilities.map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-surface-variant/20 rounded-xl text-xs text-on-surface">
                    <span>• {r}</span>
                    <button
                      type="button"
                      onClick={() => setResponsibilities(responsibilities.filter((_, i) => i !== idx))}
                      className="text-outline hover:text-error"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une mission..."
                  value={newResp}
                  onChange={(e) => setNewResp(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddResp}>
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-3 pt-4 border-t border-outline-variant/20">
              <label className="text-xs font-bold uppercase tracking-wider text-primary block">
                Compétences & Profil requis
              </label>
              <div className="space-y-2">
                {requirements.map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-surface-variant/20 rounded-xl text-xs text-on-surface">
                    <span>✓ {r}</span>
                    <button
                      type="button"
                      onClick={() => setRequirements(requirements.filter((_, i) => i !== idx))}
                      className="text-outline hover:text-error"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un critère ou diplôme..."
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddReq}>
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 pt-4 border-t border-outline-variant/20">
              <label className="text-xs font-bold uppercase tracking-wider text-primary block">
                Avantages offerts (Perks)
              </label>
              <div className="space-y-2">
                {benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-secondary-container/15 rounded-xl text-xs text-secondary font-medium">
                    <span>★ {b}</span>
                    <button
                      type="button"
                      onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}
                      className="text-outline hover:text-error"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un avantage (ex: Télétravail, Véhicule de service...)"
                  value={newBen}
                  onChange={(e) => setNewBen(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddBen}>
                  Ajouter
                </Button>
              </div>
            </div>
          </section>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/recruteur/offres')}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<span className="material-symbols-outlined text-[20px]">save</span>}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
