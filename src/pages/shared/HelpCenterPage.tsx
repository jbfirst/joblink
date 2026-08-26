import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
}

const CANDIDATE_FAQS: FaqItem[] = [
  {
    question: 'Comment postuler à une offre ?',
    answer: 'Ouvrez l\'offre qui vous intéresse depuis "Offres d\'emploi", puis cliquez sur "Postuler". Assurez-vous d\'avoir ajouté un CV dans votre profil au préalable pour une candidature en un clic.'
  },
  {
    question: 'Comment ajouter ou remplacer mon CV ?',
    answer: 'Rendez-vous dans "Mon Profil" (espace candidat), section "Mon Curriculum Vitae (CV)". Vous pouvez y envoyer un fichier PDF ou Word, le télécharger, ou le remplacer à tout moment.'
  },
  {
    question: 'Comment suivre mes candidatures ?',
    answer: 'La page "Mes candidatures" liste toutes vos candidatures avec leur statut (Nouveau, En cours, Entretien, Refusé, etc.), mis à jour par les recruteurs.'
  },
  {
    question: 'Comment sauvegarder une offre pour plus tard ?',
    answer: 'Cliquez sur l\'icône en forme de marque-page sur une offre pour l\'ajouter à vos favoris. Vous les retrouverez depuis votre profil.'
  }
];

const RECRUITER_FAQS: FaqItem[] = [
  {
    question: 'Comment publier une offre d\'emploi ?',
    answer: 'Depuis votre espace recruteur, cliquez sur "Publier une offre", remplissez les informations du poste, puis validez. L\'offre est immédiatement visible par les candidats.'
  },
  {
    question: 'Comment modifier ou supprimer une offre ?',
    answer: 'Dans "Gérer mes offres", chaque offre dispose de boutons Modifier et Supprimer. Vous ne pouvez gérer que les offres que vous avez vous-même publiées.'
  },
  {
    question: 'Comment clôturer temporairement une offre ?',
    answer: 'Utilisez le bouton "Clôturer" sur une offre depuis "Gérer mes offres" pour la retirer des résultats de recherche sans la supprimer. Vous pouvez la rouvrir à tout moment.'
  },
  {
    question: 'Comment consulter les candidatures reçues ?',
    answer: 'La page "Candidatures" de votre espace recruteur regroupe tous les profils ayant postulé à vos offres, avec leur CV et leurs coordonnées.'
  }
];

const FaqAccordionItem: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left"
      >
        <span className="text-sm font-bold text-primary">{item.question}</span>
        <span className={`material-symbols-outlined text-outline transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
};

export const HelpCenterPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Centre d'aide</h1>
        <p className="text-sm text-on-surface-variant">
          Retrouvez les réponses aux questions les plus fréquentes sur JobLink Togo.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">person</span>
          Pour les candidats
        </h2>
        <div className="space-y-3">
          {CANDIDATE_FAQS.map((item) => (
            <FaqAccordionItem key={item.question} item={item} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">business_center</span>
          Pour les recruteurs
        </h2>
        <div className="space-y-3">
          {RECRUITER_FAQS.map((item) => (
            <FaqAccordionItem key={item.question} item={item} />
          ))}
        </div>
      </section>

      <section className="bg-primary-fixed/40 border border-primary/20 rounded-2xl p-6 text-center space-y-3">
        <h2 className="text-base font-bold text-primary">Vous n'avez pas trouvé votre réponse ?</h2>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Contactez-nous directement, nous répondons rapidement.
        </p>
        <a
          href="mailto:joblinktogo.contact@gmail.com"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          joblinktogo@gmail.com
        </a>
      </section>

      <div className="text-center">
        <Link to="/parametres" className="text-xs text-on-surface-variant hover:text-primary underline">
          Retour aux paramètres du compte
        </Link>
      </div>
    </div>
  );
};
