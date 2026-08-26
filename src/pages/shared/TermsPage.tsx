import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Conditions d'utilisation</h1>
        <p className="text-xs text-on-surface-variant mt-1">Dernière mise à jour : {new Date().getFullYear()}</p>
      </div>

      <div className="space-y-6 text-sm text-on-surface leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">1. Objet</h2>
          <p>
            JobLink Togo est une plateforme de mise en relation entre candidats à l'emploi et recruteurs
            au Togo. En créant un compte, vous acceptez les présentes conditions d'utilisation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">2. Comptes utilisateurs</h2>
          <p>
            Chaque utilisateur est responsable de l'exactitude des informations fournies lors de son
            inscription, ainsi que de la confidentialité de ses identifiants de connexion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">3. Contenu publié</h2>
          <p>
            Les offres d'emploi publiées par les recruteurs doivent correspondre à des postes réels
            et respecter la législation togolaise du travail. Les candidats s'engagent à fournir des
            informations exactes dans leur profil et leur CV.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">4. Responsabilité</h2>
          <p>
            JobLink Togo agit en tant qu'intermédiaire technique et ne garantit pas l'issue des
            candidatures ni l'exactitude des informations publiées par les tiers utilisateurs de la
            plateforme.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">5. Modification des conditions</h2>
          <p>
            Ces conditions peuvent être mises à jour à tout moment. La poursuite de l'utilisation de
            la plateforme après modification vaut acceptation des nouvelles conditions.
          </p>
        </section>
      </div>
    </div>
  );
};
