import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RecruiterSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/connexion');
  };

  const links = [
    {
      to: '/recruteur/dashboard',
      label: 'Tableau de bord',
      icon: 'dashboard'
    },
    {
      to: '/recruteur/publier-offre',
      label: 'Publier une offre',
      icon: 'add_circle'
    },
    {
      to: '/recruteur/offres',
      label: 'Gestion des offres',
      icon: 'work'
    },
    {
      to: '/recruteur/candidatures',
      label: 'Pipeline Candidats',
      icon: 'people'
    },
    {
      to: '/recruteur/entreprise',
      label: 'Profil Entreprise',
      icon: 'business'
    },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: 'notifications'
    },
    {
      to: '/parametres',
      label: 'Paramètres',
      icon: 'settings'
    }
  ];

  return (
    <aside className="hidden md:flex flex-col h-[calc(100vh-4rem)] w-72 bg-surface border-r border-outline-variant/30 py-6 pr-3 sticky top-16 shrink-0">
      {/* Company/Recruiter Header Widget */}
      <div className="px-5 mb-6 flex items-center gap-3.5 pb-6 border-b border-outline-variant/20">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
          alt="TechHub Lomé"
          className="w-12 h-12 rounded-xl object-cover shadow-sm border border-outline-variant/40 p-0.5 bg-white"
        />
        <div className="min-w-0">
          <h3 className="font-bold text-sm text-primary truncate">{user?.name || 'Recruteur'}</h3>
          <p className="text-xs text-on-surface-variant truncate">Espace Recrutement</p>
          <div className="flex items-center gap-1 text-[11px] text-secondary font-medium mt-0.5">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            <span>{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1.5 flex-grow">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3.5 px-5 py-3 text-sm font-semibold rounded-r-full transition-all ${
                isActive
                  ? 'bg-primary-fixed text-on-primary-fixed font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Help Section */}
      <div className="px-3 pt-4 border-t border-outline-variant/20 space-y-1">
        <Link
          to="/aide"
          className="flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-variant/40 rounded-r-full transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">support_agent</span>
          <span>Support Recruteurs</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium text-error hover:bg-error/10 rounded-r-full transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
};
