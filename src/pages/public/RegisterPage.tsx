import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const { updateCandidateProfile } = useJob();
  const { showToast } = useToast();

  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lomé');
  const [professionOrCompany, setProfessionOrCompany] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast('Conditions requises', 'Veuillez accepter les conditions d\'utilisation.', 'warning');
      return;
    }
    if (password.length < 8) {
      showToast('Mot de passe trop court', 'Le mot de passe doit contenir au moins 8 caractères.', 'warning');
      return;
    }
    setIsLoading(true);

    try {
      await register(email, password, fullName, role);

      if (role === 'candidate' && fullName) {
        updateCandidateProfile({
          fullName,
          email,
          phone: phone ? `+228 ${phone}` : '+228 90 00 00 00',
          location: `${city}, Togo`,
          title: professionOrCompany || 'Professionnel au Togo'
        });
      }

      showToast(
        'Compte créé avec succès !',
        role === 'candidate'
          ? 'Bienvenue sur JobLink Togo ! Complétez votre profil.'
          : 'Compte recruteur activé ! Vous pouvez publier des offres.',
        'success'
      );

      navigate(role === 'candidate' ? '/candidat/dashboard' : '/recruteur/dashboard');
    } catch (error: any) {
      console.error('Erreur d\'inscription :', error);
      const message = error?.message?.includes('already exists') || error?.code === 409
        ? 'Un compte existe déjà avec cet email.'
        : 'Une erreur est survenue lors de la création du compte.';
      showToast('Inscription impossible', message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-drawer space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
            <span className="text-secondary-container">J</span>L
          </div>
          <h1 className="text-2xl font-extrabold text-primary">Rejoindre JobLink Togo</h1>
          <p className="text-xs text-on-surface-variant">
            Créez votre compte gratuit en quelques instants pour démarrer.
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
              role === 'candidate'
                ? 'border-primary bg-primary-fixed/40 ring-2 ring-primary/20'
                : 'border-outline-variant/40 bg-surface hover:border-primary/30'
            }`}
          >
            <span className="material-symbols-outlined text-primary text-2xl">person_search</span>
            <div>
              <h4 className="font-bold text-xs text-primary">Chercheur d'emploi</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Pour postuler et booster ma carrière</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
              role === 'recruiter'
                ? 'border-secondary bg-secondary-container/30 ring-2 ring-secondary/20'
                : 'border-outline-variant/40 bg-surface hover:border-secondary/30'
            }`}
          >
            <span className="material-symbols-outlined text-secondary text-2xl">business_center</span>
            <div>
              <h4 className="font-bold text-xs text-secondary">Recruteur</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Pour publier des offres et recruter</p>
            </div>
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={role === 'candidate' ? 'Nom et Prénoms' : 'Nom du responsable / Recruteur'}
            placeholder="Ex: Kodjo Mensah"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            leftIcon={<span className="material-symbols-outlined text-[18px]">person</span>}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Adresse Email professionnelle"
              type="email"
              placeholder="votre.email@domaine.tg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<span className="material-symbols-outlined text-[18px]">mail</span>}
            />

            <Input
              label="Téléphone (Togo)"
              placeholder="90 12 34 56"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              leftIcon={<span className="text-xs font-bold text-primary">🇹🇬 +228</span>}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Ville de résidence au Togo"
              options={['Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé', 'Dapaong', 'Tsévié', 'Aného']}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              leftIcon={<span className="material-symbols-outlined text-[18px]">location_on</span>}
            />

            <Input
              label={role === 'candidate' ? 'Métier / Titre visé' : 'Nom de l\'entreprise'}
              placeholder={role === 'candidate' ? 'Ex: Développeur Full Stack' : 'Ex: TechVision Togo'}
              value={professionOrCompany}
              onChange={(e) => setProfessionOrCompany(e.target.value)}
              required
              leftIcon={<span className="material-symbols-outlined text-[18px]">work</span>}
            />
          </div>

          <Input
            label="Mot de passe de sécurité"
            type="password"
            placeholder="Minimum 8 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<span className="material-symbols-outlined text-[18px]">lock</span>}
          />

          <label className="flex items-start gap-2 text-xs text-on-surface-variant cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded text-primary focus:ring-primary"
            />
            <span>
              J'accepte les <a href="#" className="font-semibold text-primary underline">Conditions Générales d'Utilisation</a> et la politique de confidentialité de JobLink Togo.
            </span>
          </label>

          <Button
            type="submit"
            variant={role === 'candidate' ? 'primary' : 'secondary'}
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Créer mon compte {role === 'candidate' ? 'Candidat' : 'Recruteur'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="text-[11px] text-on-surface-variant font-semibold uppercase">ou</span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-variant/30 transition-colors text-sm font-semibold text-on-surface"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuer avec Google
        </button>

        {/* Login redirect */}
        <div className="text-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
          Vous possédez déjà un compte ?{' '}
          <Link to="/connexion" className="font-bold text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};
