import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { useNotifications } from '../../context/NotificationContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { activeRole } = useJob();
  const { unreadCount } = useNotifications();

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/30 shadow-drawer px-2">
      {/* Jobs */}
      <Link
        to="/offres"
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
          isCurrent('/offres')
            ? 'bg-secondary-container text-on-secondary-container font-bold scale-105'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">search</span>
        <span className="text-[10px] font-semibold mt-0.5">Offres</span>
      </Link>

      {/* Candidatures */}
      <Link
        to={activeRole === 'candidate' ? '/candidat/candidatures' : '/recruteur/candidatures'}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
          isCurrent('/candidat/candidatures') || isCurrent('/recruteur/candidatures')
            ? 'bg-secondary-container text-on-secondary-container font-bold scale-105'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
        <span className="text-[10px] font-semibold mt-0.5">Postulé</span>
      </Link>

      {/* Publier (Recruteur) ou Mon Profil (Candidat) */}
      <Link
        to={activeRole === 'candidate' ? '/candidat/profil' : '/recruteur/publier-offre'}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
          isCurrent(activeRole === 'candidate' ? '/candidat/profil' : '/recruteur/publier-offre')
            ? 'bg-secondary-container text-on-secondary-container font-bold scale-105'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">
          {activeRole === 'candidate' ? 'badge' : 'add_circle'}
        </span>
        <span className="text-[10px] font-semibold mt-0.5">
          {activeRole === 'candidate' ? 'Profil' : 'Publier'}
        </span>
      </Link>

      {/* Dashboard / Profile */}
      <Link
        to={activeRole === 'candidate' ? '/candidat/dashboard' : '/recruteur/dashboard'}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
          isCurrent('/candidat/dashboard') || isCurrent('/recruteur/dashboard') || isCurrent('/candidat/profil')
            ? 'bg-secondary-container text-on-secondary-container font-bold scale-105'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">person</span>
        <span className="text-[10px] font-semibold mt-0.5">Espace</span>
      </Link>

      {/* Notifications / Menu */}
      <Link
        to="/notifications"
        className={`relative flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
          isCurrent('/notifications')
            ? 'bg-secondary-container text-on-secondary-container font-bold scale-105'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 bg-secondary rounded-full" />
        )}
        <span className="text-[10px] font-semibold mt-0.5">Alertes</span>
      </Link>
    </nav>
  );
};
