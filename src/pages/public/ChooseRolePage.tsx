import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ChooseRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, chooseRole } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<'candidate' | 'recruiter' | null>(null);

  const handleChoose = async (role: 'candidate' | 'recruiter') => {
    setIsLoading(role);
    try {
      const appUser = await chooseRole(role);
      showToast(
        'Bienvenue sur JobLink Togo !',
        role === 'candidate' ? 'Votre espace candidat est prêt.' : 'Votre espace recruteur est prêt.',
        'success'
      );
      navigate(appUser.role === 'candidate' ? '/candidat/dashboard' : '/recruteur/dashboard');
    } catch (error) {
      console.error('Erreur choix du rôle :', error);
      showToast('Erreur', 'Impossible d\'enregistrer votre choix. Réessayez.', 'error');
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-4">
      <div className="max-w-lg w-full bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">
            Bienvenue{user?.name ? `, ${user.name}` : ''} 👋
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Dernière étape : comment souhaitez-vous utiliser JobLink Togo ?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            onClick={() => handleChoose('candidate')}
            disabled={isLoading !== null}
            className="p-6 rounded-2xl border-2 border-outline-variant/40 hover:border-primary hover:bg-primary-fixed/30 transition-all text-left space-y-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-primary text-3xl">person</span>
            <h3 className="font-bold text-primary">Je cherche un emploi</h3>
            <p className="text-xs text-on-surface-variant">
              Créez votre profil candidat, postulez aux offres et suivez vos candidatures.
            </p>
            {isLoading === 'candidate' && (
              <p className="text-xs text-primary font-semibold">Configuration en cours...</p>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleChoose('recruiter')}
            disabled={isLoading !== null}
            className="p-6 rounded-2xl border-2 border-outline-variant/40 hover:border-secondary hover:bg-secondary-container/20 transition-all text-left space-y-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-secondary text-3xl">business_center</span>
            <h3 className="font-bold text-primary">Je recrute</h3>
            <p className="text-xs text-on-surface-variant">
              Publiez des offres d'emploi et gérez vos candidatures.
            </p>
            {isLoading === 'recruiter' && (
              <p className="text-xs text-secondary font-semibold">Configuration en cours...</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
