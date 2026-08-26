import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { JobCard } from '../../components/jobs/JobCard';
import { Button } from '../../components/common/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, companies, setFilters } = useJob();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const recentJobs = jobs.slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      searchQuery: searchTitle,
      location: searchLocation
    }));
    navigate('/offres');
  };

  const sectorDefs = [
    { name: 'Informatique & Technologies', icon: 'code', color: 'bg-blue-50 text-primary' },
    { name: 'Banque & Finance', icon: 'account_balance', color: 'bg-emerald-50 text-secondary' },
    { name: 'Logistique & Transport', icon: 'directions_boat', color: 'bg-indigo-50 text-indigo-700' },
    { name: 'BTP & Construction', icon: 'engineering', color: 'bg-amber-50 text-amber-700' },
    { name: 'Agro-industrie', icon: 'eco', color: 'bg-green-50 text-green-700' },
    { name: 'Santé & Médical', icon: 'medical_services', color: 'bg-rose-50 text-rose-700' },
  ];

  // Nombre réel d'offres par secteur, calculé à partir des vraies données
  const sectors = sectorDefs.map((s) => ({
    ...s,
    count: `${jobs.filter((j) => j.industry === s.name).length} poste(s)`
  }));

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-8 py-8 space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row gap-10 items-center">
        <div className="flex-1 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-xs font-bold border border-secondary/20 w-fit">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            N°1 de l'emploi & du recrutement au Togo 🇹🇬
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Trouvez l'emploi de vos rêves au <span className="text-secondary">Togo</span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Connectez-vous aux meilleures opportunités professionnelles à Lomé, Kara, Sokodé et partout au Togo. Que vous cherchiez votre premier emploi ou la prochaine étape de votre carrière.
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleHeroSearch}
            className="bg-surface-container-lowest p-3 sm:p-4 rounded-2xl shadow-drawer border border-outline-variant/40 flex flex-col sm:flex-row gap-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all"
          >
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-surface-variant/30 rounded-xl">
              <span className="material-symbols-outlined text-outline">search</span>
              <input
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-on-surface placeholder:text-outline-variant text-sm font-medium p-0"
                placeholder="Titre de poste, mot-clé, compétence..."
                type="text"
              />
            </div>

            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-surface-variant/30 rounded-xl">
              <span className="material-symbols-outlined text-outline">location_on</span>
              <input
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-on-surface placeholder:text-outline-variant text-sm font-medium p-0"
                placeholder="Lomé, Kara, Sokodé..."
                type="text"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="shrink-0">
              Rechercher
            </Button>
          </form>

          {/* Popular searches pills */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant flex-wrap">
            <span className="font-semibold text-primary">Populaire :</span>
            {['Développeur React', 'Comptable Lomé', 'Stage Informatique', 'Logistique Portuaire'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, searchQuery: item }));
                  navigate('/offres');
                }}
                className="px-2.5 py-1 rounded-full bg-surface-variant/40 hover:bg-surface-variant text-on-surface transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Visual Image */}
        <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-lift h-72 sm:h-96 lg:h-[460px] relative group">
          <img
            src="/images/hero-team.jpg"
            alt="Professionnels togolais en entreprise"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-xs font-semibold text-secondary-container uppercase tracking-wider">
              Talents d'excellence au Togo
            </span>
            <h3 className="text-lg sm:text-xl font-bold mt-1">
              Des centaines de recrutements chaque mois
            </h3>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-outline-variant/30 hover:border-primary/30 transition-colors">
          <span className="text-3xl md:text-4xl font-extrabold text-primary mb-1">{jobs.length}</span>
          <span className="text-xs md:text-sm font-medium text-on-surface-variant">Offres actives</span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-outline-variant/30 hover:border-secondary/30 transition-colors">
          <span className="text-3xl md:text-4xl font-extrabold text-secondary mb-1">{companies.length}</span>
          <span className="text-xs md:text-sm font-medium text-on-surface-variant">Entreprises partenaires</span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-outline-variant/30 hover:border-primary/30 transition-colors">
          <span className="text-3xl md:text-4xl font-extrabold text-primary mb-1">6</span>
          <span className="text-xs md:text-sm font-medium text-on-surface-variant">Secteurs d'activité</span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-outline-variant/30 hover:border-secondary/30 transition-colors">
          <span className="text-3xl md:text-4xl font-extrabold text-secondary mb-1">100%</span>
          <span className="text-xs md:text-sm font-medium text-on-surface-variant">Gratuit pour les candidats</span>
        </div>
      </section>

      {/* Dual Path Bento Cards */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Candidate Card */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-soft border border-outline-variant/40 hover:shadow-lift hover:border-primary/30 transition-all group flex flex-col justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
              <span className="material-symbols-outlined text-3xl">person_search</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">Je suis un candidat</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Parcourez des centaines d'offres d'emploi au Togo, créez votre profil professionnel et postulez en un clic auprès des meilleurs employeurs de Lomé et des régions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
            <Button
              variant="primary"
              onClick={() => navigate('/inscription')}
            >
              Créer mon profil candidat
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/offres')}
            >
              Explorer les offres
            </Button>
          </div>
        </div>

        {/* Recruiter Card */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-soft border border-outline-variant/40 hover:shadow-lift hover:border-secondary/30 transition-all group flex flex-col justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shrink-0">
              <span className="material-symbols-outlined text-3xl">business_center</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">Je suis un recruteur</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Publiez vos offres, suivez vos candidatures sur un pipeline interactif et recrutez les meilleurs talents togolais qualifiés pour propulser votre entreprise.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
            <Button
              variant="secondary"
              onClick={() => navigate('/recruteur/publier-offre')}
            >
              Publier une offre
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/recruteur/dashboard')}
            >
              Espace Recruteur
            </Button>
          </div>
        </div>
      </section>

      {/* Secteurs porteurs au Togo */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary">
              Secteurs qui recrutent au Togo
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Explorez les opportunités professionnelles par filière d'activité.
            </p>
          </div>
          <Link
            to="/offres"
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
          >
            Tous les secteurs <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {sectors.map((sec) => (
            <div
              key={sec.name}
              onClick={() => {
                setFilters((prev) => ({ ...prev, industry: sec.name }));
                navigate('/offres');
              }}
              className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 hover:border-primary/30 hover:shadow-lift transition-all cursor-pointer flex flex-col items-center text-center gap-3 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${sec.color}`}>
                <span className="material-symbols-outlined text-2xl">{sec.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-primary group-hover:text-secondary transition-colors line-clamp-1">
                  {sec.name}
                </h4>
                <span className="text-[11px] text-on-surface-variant mt-0.5 block">
                  {sec.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Featured Jobs */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary">
              Offres d'Emploi Récentes
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Les dernières opportunités publiées par nos entreprises partenaires au Togo.
            </p>
          </div>
          <Link
            to="/offres"
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
          >
            Voir tout ({jobs.length}) <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lift flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 z-10 max-w-xl">
          <span className="text-xs font-bold text-secondary-container uppercase tracking-wider">
            Rejoignez la communauté JobLink
          </span>
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Prêt à accélérer votre carrière au Togo ?
          </h3>
          <p className="text-sm text-primary-fixed leading-relaxed">
            Créez votre compte en moins de 2 minutes et recevez des alertes pour les offres qui correspondent exactement à vos compétences.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 z-10 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/inscription')}
            className="w-full sm:w-auto"
          >
            Commencer maintenant
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/connexion')}
            className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
          >
            Se connecter
          </Button>
        </div>
      </section>
    </div>
  );
};
