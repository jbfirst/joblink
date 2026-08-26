import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Politique de confidentialité</h1>
        <p className="text-xs text-on-surface-variant mt-1">Dernière mise à jour : {new Date().getFullYear()}</p>
      </div>

      <div className="space-y-6 text-sm text-on-surface leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">1. Données collectées</h2>
          <p>
            Nous collectons les informations que vous nous fournissez directement : nom, email,
            téléphone, expériences, compétences, ainsi que les fichiers que vous téléversez (CV,
            photo de profil).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">2. Utilisation des données</h2>
          <p>
            Vos données sont utilisées uniquement pour faciliter la mise en relation entre candidats
            et recruteurs : affichage de votre profil aux recruteurs (côté candidat), gestion de vos
            offres publiées (côté recruteur), et amélioration du service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">3. Partage des données</h2>
          <p>
            Votre CV et vos informations de profil sont visibles par les recruteurs lorsque vous
            postulez à une offre. Nous ne vendons ni ne partageons vos données avec des tiers à des
            fins commerciales.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">4. Sécurité</h2>
          <p>
            Vos données sont hébergées sur une infrastructure sécurisée (Appwrite Cloud). Chaque
            recruteur ne peut modifier ou supprimer que les offres qu'il a lui-même publiées.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary">5. Vos droits</h2>
          <p>
            Vous pouvez à tout moment modifier ou supprimer les informations de votre profil depuis
            votre espace personnel. Pour toute demande spécifique, contactez-nous.
          </p>
        </section>
      </div>
    </div>
  );
};
