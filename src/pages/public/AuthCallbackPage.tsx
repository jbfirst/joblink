import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Page atterrissage après une connexion Google réussie.
 * Appwrite redirige ici automatiquement (URL "success" configurée
 * dans loginWithGoogle). On rafraîchit simplement l'état d'auth,
 * puis on laisse le routage (ProtectedRoute) décider où aller :
 * - vers /choisir-role si c'est un tout nouveau compte
 * - vers le bon dashboard sinon
 */
export const AuthCallbackPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'candidate' | 'recruiter' | 'no-role'>('loading');

  useEffect(() => {
    const finish = async () => {
      const appUser = await refreshUser();
      if (!appUser) {
        setStatus('no-role'); // sera de toute façon renvoyé vers /connexion
        return;
      }
      if (!appUser.role) {
        setStatus('no-role');
      } else {
        setStatus(appUser.role);
      }
    };
    finish();
  }, [refreshUser]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-on-surface-variant">Connexion en cours...</p>
      </div>
    );
  }

  if (status === 'no-role') return <Navigate to="/choisir-role" replace />;
  if (status === 'candidate') return <Navigate to="/candidat/dashboard" replace />;
  return <Navigate to="/recruteur/dashboard" replace />;
};
