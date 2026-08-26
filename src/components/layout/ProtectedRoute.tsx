import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../lib/appwrite';

interface ProtectedRouteProps {
  allowedRole: UserRole;
}

/**
 * Bloque l'accès à un espace (candidat ou recruteur) si :
 * - l'utilisateur n'est pas connecté → renvoi vers /connexion
 * - l'utilisateur est connecté mais avec le mauvais rôle → renvoi vers son propre espace
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-on-surface-variant">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  if (!user.role) {
    return <Navigate to="/choisir-role" replace />;
  }

  if (user.role !== allowedRole) {
    const redirectPath = user.role === 'candidate' ? '/candidat/dashboard' : '/recruteur/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
