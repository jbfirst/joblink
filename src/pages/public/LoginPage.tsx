import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const appUser = await login(email, password);
      showToast(
        'Connexion réussie',
        appUser.role === 'candidate' ? 'Bienvenue dans votre espace candidat !' : 'Bienvenue dans votre espace recruteur !',
        'success'
      );
      navigate(appUser.role === 'candidate' ? '/candidat/dashboard' : '/recruteur/dashboard');
    } catch (error) {
      console.error('Erreur de connexion :', error);
      showToast(
        'Connexion impossible',
        'Vérifiez votre email et votre mot de passe, puis réessayez.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-drawer space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
            <span className="text-secondary-container">J</span>L
          </div>
          <h1 className="text-2xl font-extrabold text-primary">Connexion à JobLink Togo</h1>
          <p className="text-xs text-on-surface-variant">
            Accédez à votre espace pour gérer votre carrière ou vos recrutements.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Adresse Email"
            type="email"
            placeholder="votre.email@domaine.tg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<span className="material-symbols-outlined text-[18px]">mail</span>}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<span className="material-symbols-outlined text-[18px]">lock</span>}
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <span>Se souvenir de moi</span>
            </label>
            <a href="#" className="font-semibold text-secondary hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Se connecter
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="text-[11px] text-on-surface-variant font-semibold uppercase">ou</span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        {/* Google Sign In */}
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

        {/* Register Link */}
        <div className="text-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
          Vous n'avez pas encore de compte ?{' '}
          <Link to="/inscription" className="font-bold text-primary hover:underline">
            S'inscrire gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
};
