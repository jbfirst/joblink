import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { user, logout } = useAuth();
  const { candidateProfile, recruiterCompany } = useJob();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 shadow-sm z-50 transition-all">
      <div className="max-w-container-max mx-auto h-16 px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            <span className="text-secondary-container">J</span>L
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-primary block leading-none">
              JobLink <span className="text-secondary font-bold text-base">Togo</span>
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium tracking-wide hidden sm:block">
              Lomé • Kara • Sokodé
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/offres"
            className={`text-sm font-semibold transition-colors ${
              isCurrent('/offres')
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Offres d'emploi
          </Link>
          <Link
            to="/candidat/candidatures"
            className={`text-sm font-semibold transition-colors ${
              isCurrent('/candidat/candidatures')
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Mes candidatures
          </Link>
          <Link
            to="/recruteur/publier-offre"
            className={`text-sm font-semibold transition-colors ${
              isCurrent('/recruteur/publier-offre')
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Publier une offre
          </Link>
          <Link
            to="/entreprises/comp-1"
            className={`text-sm font-semibold transition-colors ${
              isCurrent('/entreprises')
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Entreprises
          </Link>
        </nav>

        {/* Right Action Icons & Auth State */}
        <div className="flex items-center gap-3">
          {/* Notifications Link (masqué sur mobile : déjà présent dans la barre du bas) */}
          <Link
            to="/notifications"
            className="relative w-10 h-10 rounded-full hidden md:flex items-center justify-center text-primary hover:bg-surface-variant/50 transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-secondary text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile / Login Access */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.role === 'candidate' ? '/candidat/dashboard' : '/recruteur/dashboard'}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 transition-all group"
              >
                {(() => {
                  const realImage = user.role === 'candidate' ? candidateProfile.avatar : recruiterCompany?.logo;
                  if (realImage) {
                    return (
                      <img
                        src={realImage}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full object-cover border border-white"
                      />
                    );
                  }
                  return (
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold border border-white">
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  );
                })()}
                <span className="text-xs font-bold text-primary hidden md:inline">
                  {user.role === 'candidate' ? 'Espace Candidat' : 'Espace Recruteur'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Se déconnecter"
                className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/connexion"
                className="px-4 py-2 rounded-full text-xs font-bold text-primary hover:bg-surface-variant/50 transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
