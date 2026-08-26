import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { JobCard } from '../../components/jobs/JobCard';
import { ContractType, WorkMode, Job } from '../../types';

export const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { addJob } = useJob();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('TechHub Lomé');
  const [location, setLocation] = useState('Lomé');
  const [industry, setIndustry] = useState('Informatique & Technologies');
  const [contractType, setContractType] = useState<ContractType>('CDI');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybride');
  const [experienceLevel, setExperienceLevel] = useState('Intermédiaire (2-5 ans)');
  const [salaryMin, setSalaryMin] = useState<number>(500000);
  const [salaryMax, setSalaryMax] = useState<number>(850000);
  const [deadline, setDeadline] = useState('2026-10-31');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Concevoir et développer de nouvelles fonctionnalités selon les spécifications.',
    'Participer aux réunions d\'équipe et aux revues de code hebdomadaires.'
  ]);
  const [newResp, setNewResp] = useState('');
  const [requirements, setRequirements] = useState<string[]>([
    'Diplôme d\'études supérieures en lien avec le poste (Bac+3/5).',
    'Expérience minimum de 2 ans dans un environnement similaire au Togo.'
  ]);
  const [newReq, setNewReq] = useState('');
  const [benefits, setBenefits] = useState<string[]>([
    'Assurance maladie entreprise',
    'Primes de performance'
  ]);
  const [newBen, setNewBen] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewJob: Job = {
    id: 'preview-temp',
    title: title || 'Intitulé du poste d\'exemple',
    company,
    companyId: 'comp-1',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    location,
    workMode,
    contractType,
    industry,
    experienceLevel,
    salaryMin,
    salaryMax,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: 'Nouveau',
    postedDate: 'Aujourd\'hui',
    deadline,
    description: description || 'Description du poste en cours de rédaction...',
    responsibilities,
    requirements,
    benefits,
    applicantsCount: 0,
    viewsCount: 1
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
    if (!title || !description) {
      showToast('Formulaire incomplet', 'Veuillez renseigner au moins le titre et la description.', 'warning');
      return;
    }
    setIsSubmitting(true);

    setTimeout(async () => {
      const created = await addJob({
        title,
        company,
        companyId: 'comp-1',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        location,
        workMode,
        contractType,
        industry,
        experienceLevel,
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        salaryPeriod: 'mois',
        currency: 'FCFA',
        status: 'Nouveau',
        deadline,
        description,
        responsibilities,
        requirements,
        benefits,
        featured: true
      });

      setIsSubmitting(false);
      showToast(
        'Offre publiée avec succès !',
        `L'annonce "${title}" est désormais visible par tous les candidats.`,
        'success'
      );
      addNotification({
        title: 'Offre publiée',
        message: `Votre offre "${title}" est en ligne et reçoit dès à présent des candidatures.`,
        type: 'job_alert',
        link: `/offres/${created.id}`
      });
      navigate('/recruteur/offres');
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Publier une nouvelle offre d'emploi</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Remplissez les détails du poste pour attirer les meilleurs profils togolais.
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
            <Button type="button" variant="ghost" onClick={() => navigate('/recruteur/dashboard')}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<span className="material-symbols-outlined text-[20px]">send</span>}
            >
              Publier l'offre d'emploi
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
