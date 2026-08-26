import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';

export const CandidateSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidateProfile } = useJob();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/connexion');
  };

  const links = [
    {
      to: '/candidat/dashboard',
      label: 'Tableau de bord',
      icon: 'dashboard'
    },
    {
      to: '/candidat/profil',
      label: 'Mon CV & Profil',
      icon: 'description'
    },
    {
      to: '/candidat/candidatures',
      label: 'Mes candidatures',
      icon: 'assignment_turned_in'
    },
    {
      to: '/offres',
      label: 'Explorer les offres',
      icon: 'search'
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
      {/* Profile Header Widget */}
      <div className="px-5 mb-6 flex items-center gap-3.5 pb-6 border-b border-outline-variant/20">
        <img
          src={candidateProfile.avatar}
          alt={candidateProfile.fullName}
          className="w-12 h-12 rounded-full object-cover shadow-sm border border-outline-variant/40"
        />
        <div className="min-w-0">
          <h3 className="font-bold text-sm text-primary truncate">{candidateProfile.fullName}</h3>
          <p className="text-xs text-on-surface-variant truncate">{candidateProfile.title}</p>
          <div className="flex items-center gap-1 text-[11px] text-secondary font-medium mt-0.5">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            <span>{candidateProfile.location}</span>
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
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          <span>Centre d'aide & Support</span>
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
