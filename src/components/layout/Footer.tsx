import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 pt-16 pb-24 md:pb-12 text-on-surface">
      <div className="max-w-container-max mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                <span className="text-secondary-container">J</span>L
              </div>
              <span className="text-xl font-extrabold tracking-tight text-primary">
                JobLink <span className="text-secondary">Togo</span>
              </span>
            </Link>
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
              La plateforme de référence pour l'emploi, les stages et le recrutement professionnel au Togo. Connecter les talents togolais aux opportunités qui comptent.
            </p>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
              <span>Lomé - Togo</span>
            </div>
          </div>

          {/* Candidats Col */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Candidats</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <Link to="/offres" className="hover:text-primary transition-colors">
                  Toutes les offres
                </Link>
              </li>
              <li>
                <Link to="/candidat/dashboard" className="hover:text-primary transition-colors">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link to="/candidat/profil" className="hover:text-primary transition-colors">
                  Mon CV & Profil
                </Link>
              </li>
              <li>
                <Link to="/candidat/candidatures" className="hover:text-primary transition-colors">
                  Suivi des candidatures
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruteurs Col */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Recruteurs</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <Link to="/recruteur/publier-offre" className="hover:text-primary transition-colors">
                  Publier une offre
                </Link>
              </li>
              <li>
                <Link to="/recruteur/dashboard" className="hover:text-primary transition-colors">
                  Espace Recruteur
                </Link>
              </li>
              <li>
                <Link to="/recruteur/candidatures" className="hover:text-primary transition-colors">
                  Gestion des candidats
                </Link>
              </li>
              <li>
                <Link to="/entreprises/comp-1" className="hover:text-primary transition-colors">
                  Page Entreprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Villes & Régions */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Opportunités Togo</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <Link to="/offres?location=Lom%C3%A9" className="hover:text-primary transition-colors">
                  Emploi à Lomé (Maritime)
                </Link>
              </li>
              <li>
                <Link to="/offres?location=Kara" className="hover:text-primary transition-colors">
                  Emploi à Kara (Région Kara)
                </Link>
              </li>
              <li>
                <Link to="/offres?location=Sokod%C3%A9" className="hover:text-primary transition-colors">
                  Emploi à Sokodé (Centrale)
                </Link>
              </li>
              <li>
                <Link to="/offres?location=Atakpam%C3%A9" className="hover:text-primary transition-colors">
                  Emploi à Atakpamé (Plateaux)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© 2026 JobLink Togo. Tous droits réservés. Développé pour les talents togolais.</p>
          <div className="flex gap-6">
            <Link to="/conditions" className="hover:text-primary">Conditions d'utilisation</Link>
            <Link to="/confidentialite" className="hover:text-primary">Confidentialité</Link>
            <Link to="/aide" className="hover:text-primary">Aide & Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
