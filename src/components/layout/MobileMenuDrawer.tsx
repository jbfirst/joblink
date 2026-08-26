import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const recruiterLinks = [
  { to: '/recruteur/dashboard', label: 'Tableau de bord', icon: 'dashboard' },
  { to: '/recruteur/publier-offre', label: 'Publier une offre', icon: 'add_circle' },
  { to: '/recruteur/offres', label: 'Gestion des offres', icon: 'work' },
  { to: '/recruteur/candidatures', label: 'Pipeline Candidats', icon: 'people' },
  { to: '/recruteur/entreprise', label: 'Profil Entreprise', icon: 'business' },
  { to: '/notifications', label: 'Notifications', icon: 'notifications' },
  { to: '/parametres', label: 'Paramètres', icon: 'settings' },
  { to: '/aide', label: 'Support Recruteurs', icon: 'support_agent' }
];

const candidateLinks = [
  { to: '/candidat/dashboard', label: 'Tableau de bord', icon: 'dashboard' },
  { to: '/candidat/profil', label: 'Mon CV & Profil', icon: 'description' },
  { to: '/candidat/candidatures', label: 'Mes candidatures', icon: 'assignment_turned_in' },
  { to: '/offres', label: 'Explorer les offres', icon: 'search' },
  { to: '/notifications', label: 'Notifications', icon: 'notifications' },
  { to: '/parametres', label: 'Paramètres', icon: 'settings' },
  { to: '/aide', label: "Centre d'aide", icon: 'help_outline' }
];

/**
 * Panneau plein écran affiché sur mobile uniquement (déclenché depuis le
 * bouton Menu du Navbar). Regroupe tous les liens qui existent déjà dans
 * la sidebar desktop (masquée en dessous de md), pour qu'aucune page ne
 * devienne injoignable sur téléphone.
 */
export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  const links = user.role === 'candidate' ? candidateLinks : recruiterLinks;

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute top-0 right-0 h-full w-[80%] max-w-xs bg-surface-container-lowest shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
          <span className="text-sm font-bold text-primary">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="flex items-center gap-3.5 px-5 py-3 text-sm font-medium text-on-surface hover:bg-surface-variant/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-outline-variant/20 p-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium text-error hover:bg-error/10 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
