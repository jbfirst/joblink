import { Job } from '../types';

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Developer',
    company: 'TechHub Lomé',
    companyId: 'comp-1',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    location: 'Lomé',
    workMode: 'Hybride',
    contractType: 'CDI',
    industry: 'Informatique & Technologies',
    experienceLevel: 'Senior (5+ ans)',
    salaryMin: 650000,
    salaryMax: 1100000,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: 'Ouvert',
    postedDate: '2026-08-15',
    deadline: '2026-09-30',
    featured: true,
    applicantsCount: 18,
    viewsCount: 342,
    description: 'TechHub Lomé recherche un Développeur Full Stack Senior expérimenté pour piloter la conception et le développement de nos plateformes web et mobiles à fort trafic. Vous serez au cœur des choix d\'architecture logicielle et de l\'encadrement des équipes de développeurs juniors dans un environnement résolument moderne.',
    responsibilities: [
      'Concevoir et développer des applications web et API REST/GraphQL robustes et scalables.',
      'Piloter les choix d\'architecture technique et optimiser les performances des bases de données.',
      'Mettre en place des pipelines CI/CD et veiller aux bonnes pratiques de sécurité logicielle.',
      'Superviser les revues de code, accompagner la montée en compétences des développeurs juniors.',
      'Collaborer étroitement avec les chefs de produit et les designers UI/UX.'
    ],
    requirements: [
      'Minimum 5 ans d\'expérience confirmée en développement web moderne (React, TypeScript, Node.js/NestJS).',
      'Maîtrise approfondie des bases de données relationnelles (PostgreSQL) et NoSQL (MongoDB, Redis).',
      'Expérience solide des architectures microservices, Docker et du déploiement cloud (AWS/GCP).',
      'Excellente maîtrise du français et bon niveau d\'anglais technique écrit/oral.',
      'Sens aigu de l\'organisation, autonomie et esprit d\'équipe.'
    ],
    benefits: [
      'Rémunération attractive selon profil + prime de performance annuelle',
      'Assurance santé premium prise en charge à 80% (salarié et famille)',
      'Équipement haut de gamme (MacBook Pro / double écran)',
      'Budget annuel de formation et certifications internationales',
      'Cadre de travail stimulant au cœur de Lomé avec 2 jours de télétravail par semaine'
    ]
  },
  {
    id: 'job-2',
    title: 'Analyste Financier Senior',
    company: 'Banque Atlantique Togo',
    companyId: 'comp-2',
    companyLogo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=150&auto=format&fit=crop&q=80',
    location: 'Lomé',
    workMode: 'Présentiel',
    contractType: 'CDD',
    industry: 'Banque & Finance',
    experienceLevel: 'Intermédiaire (2-5 ans)',
    salaryMin: 500000,
    salaryMax: 850000,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: 'Clôture bientôt',
    postedDate: '2026-08-10',
    deadline: '2026-08-25',
    featured: true,
    applicantsCount: 29,
    viewsCount: 512,
    description: 'La Banque Atlantique Togo recherche un(e) Analyste Financier pour renforcer sa direction des engagements et de l\'analyse des risques d\'investissement. Vous participerez activement à l\'évaluation des dossiers de crédit structuré et des grandes entreprises.',
    responsibilities: [
      'Analyser la situation financière, les bilans et les business plans des entreprises clientes.',
      'Élaborer des modèles financiers prévisionnels et des notes de synthèse pour le comité de crédit.',
      'Assurer le suivi régulier du portefeuille de crédits et identifier les risques émergents.',
      'Participer à la veille sectorielle sur les grandes filières économiques togolaises.'
    ],
    requirements: [
      'Bac+5 en Finance, Économie, Banque ou diplôme équivalent (ESGIS, FASEG, etc.).',
      '3 à 5 ans d\'expérience dans un établissement bancaire ou cabinet d\'audit.',
      'Maîtrise avancée d\'Excel, des normes comptables SYSCOHADA révisé et des ratios financiers.',
      'Rigueur exemplaire, esprit d\'analyse et capacités rédactionnelles affirmées.'
    ],
    benefits: [
      'Treizième mois et primes d\'intéressement bancaire',
      'Couverture médicale à 100%',
      'Tarifs préférentiels sur les crédits immobiliers et consommation',
      'Opportunités d\'évolution au sein du groupe régional'
    ]
  },
  {
    id: 'job-3',
    title: 'Ingénieur BTP & Génie Civil',
    company: 'BTP Construction Togo',
    companyId: 'comp-4',
    companyLogo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150&auto=format&fit=crop&q=80',
    location: 'Kara',
    workMode: 'Présentiel',
    contractType: 'CDI',
    industry: 'BTP & Construction',
    experienceLevel: 'Intermédiaire (2-5 ans)',
    salaryMin: 450000,
    salaryMax: 750000,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: 'Ouvert',
    postedDate: '2026-08-12',
    deadline: '2026-09-15',
    featured: false,
    applicantsCount: 14,
    viewsCount: 220,
    description: 'Dans le cadre du développement de nos chantiers dans la région de la Kara et des Savanes, nous recrutons un Ingénieur Conducteur de Travaux / Génie Civil pour coordonner les travaux de voirie et de construction d\'édifices.',
    responsibilities: [
      'Planifier, organiser et piloter l\'exécution quotidienne des chantiers.',
      'Veiller au respect scrupuleux des normes de sécurité, de la qualité des matériaux et du cahier des charges.',
      'Manager les chefs d\'équipes, artisans et sous-traitants sur site.',
      'Établir les métrés, rapports d\'avancement hebdomadaires et décomptes prévisionnels.'
    ],
    requirements: [
      'Diplôme d\'Ingénieur en Génie Civil ou équivalent (ENSI, Formatec, etc.).',
      'Minimum 3 ans d\'expérience sur des chantiers d\'envergure au Togo.',
      'Maîtrise des logiciels AutoCAD, MS Project et calcul de structure.',
      'Permis B indispensable, grande mobilité géographique.'
    ],
    benefits: [
      'Véhicule de fonction tout-terrain + dotation carburant',
      'Logement de fonction pris en charge à Kara',
      'Primes de fin de chantier'
    ]
  },
  {
    id: 'job-4',
    title: 'Responsable Logistique & Opérations Portuaires',
    company: 'Togo Logistics & Port Services',
    companyId: 'comp-3',
    companyLogo: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=150&auto=format&fit=crop&q=80',
    location: 'Lomé',
    workMode: 'Présentiel',
    contractType: 'CDI',
    industry: 'Logistique & Transport',
    experienceLevel: 'Senior (5+ ans)',
    salaryMin: 600000,
    salaryMax: 950000,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: 'Nouveau',
    postedDate: '2026-08-16',
    deadline: '2026-10-05',
    featured: true,
    applicantsCount: 8,
    viewsCount: 180,
    description: 'Rejoignez le cœur névralgique de notre terminal logistique au Port Autonome de Lomé. Vous assurerez la coordination fluide du trafic conteneurs, du transit vers les pays de l\'hinterland (Burkina Faso, Mali, Niger) et du respect des procédures douanières.',
    responsibilities: [
      'Superviser les flux d\'entrée et de sortie des conteneurs sur les parcs logistiques.',
      'Gérer les relations avec les armateurs, manutentionnaires et la douane togolaise (OTR).',
      'Optimiser les délais de rotation des camions et minimiser les frais de surestaries.',
      'Encadrer une équipe de 15 agents d\'exploitation et déclarants en douane.'
    ],
    requirements: [
      'Master en Logistique, Transport International, Commerce Maritime ou Douanes.',
      '5 ans d\'expérience minimum dans le milieu portuaire togolais ou sous-régional.',
      'Maîtrise parfaite des logiciels d\'exploitation portuaire et de la plateforme Guichet Unique (SEGUCE).',
      'Sens prononcé du leadership et capacité à gérer le stress en milieu à flux tendu.'
    ],
    benefits: [
      'Salaire motivant + prime trimestrielle sur objectifs de rotation',
      'Assurance santé famille complète',
      'Téléphone professionnel + forfait illimité'
    ]
  },
  {
    id: 'job-5',
    title: 'UI/UX Designer & Spécialiste Produit',
    company: 'TechHub Lomé',
    companyId: 'comp-1',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    location: 'Lomé',
    workMode: 'Hybride',
    contractType: 'CDI',
    industry: 'Informatique & Technologies',
    experienceLevel: 'Intermédiaire (2-5 ans)',
    salaryMin: 400000,
    salaryMax: 700000,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: 'Ouvert',
    postedDate: '2026-08-14',
    deadline: '2026-09-20',
    featured: false,
    applicantsCount: 22,
    viewsCount: 390,
    description: 'Nous recherchons un Designer UI/UX passionné par la conception d\'expériences utilisateur intuitives et modernes pour nos applications web et mobiles destinées aux utilisateurs togolais et ouest-africains.',
    responsibilities: [
      'Réaliser des recherches utilisateurs, entretiens et personas adaptés au contexte togolais.',
      'Créer des wireframes, prototypes interactifs et maquettes haute fidélité sur Figma.',
      'Maintenir et faire évoluer notre Design System conforme aux standards modernes.',
      'Effectuer des tests d\'utilisabilité et itérer en continu avec les développeurs frontend.'
    ],
    requirements: [
      'Portfolio démontrant des projets web/mobiles complets et bien documentés.',
      'Maîtrise experte de Figma, design tokens, auto-layout et prototypage avancé.',
      'Compréhension des contraintes techniques HTML/CSS et responsive design.',
      'Excellente créativité visuelle et sens du détail typographique.'
    ],
    benefits: [
      'Horaires flexibles & 2 jours de télétravail',
      'Abonnement Figma Pro et banques de ressources graphiques',
      'Ambiance de travail jeune, dynamique et collaborative'
    ]
  },
  {
    id: 'job-6',
    title: 'Agronome & Responsable Qualité Filière Bio',
    company: 'AgriTogo Bio',
    companyId: 'comp-5',
    companyLogo: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?w=150&auto=format&fit=crop&q=80',
    location: 'Atakpamé',
    workMode: 'Présentiel',
    contractType: 'CDI',
    industry: 'Agro-industrie',
    experienceLevel: 'Intermédiaire (2-5 ans)',
    salaryMin: 350000,
    salaryMax: 600000,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: 'Ouvert',
    postedDate: '2026-08-08',
    deadline: '2026-09-10',
    featured: false,
    applicantsCount: 11,
    viewsCount: 165,
    description: 'Sous la direction de l\'unité de transformation d\'Atakpamé, vous assurerez l\'accompagnement technique des coopératives agricoles partenaires et le contrôle de conformité aux cahiers des charges bio internationaux (Ecocert, USDA Bio).',
    responsibilities: [
      'Former et sensibiliser les groupements de producteurs aux techniques d\'agriculture biologique.',
      'Mener les audits de traçabilité et de conformité phytosanitaire sur le terrain.',
      'Contrôler la qualité des récoltes à la réception dans l\'usine de conditionnement.',
      'Rédiger les rapports techniques pour les organismes de certification.'
    ],
    requirements: [
      'Diplôme d\'Ingénieur Agronome (ESA / Université de Lomé) ou équivalent.',
      'Connaissance approfondie des normes de certification biologique.',
      'Bonne maîtrise du français et des langues locales (Ewé, Ifè ou Kabyè).',
      'Capacité à travailler en milieu rural avec les communautés paysannes.'
    ],
    benefits: [
      'Moto tout-terrain de service',
      'Indemnités de déplacement et de mission',
      'Assurance santé entreprise'
    ]
  },
  {
    id: 'job-7',
    title: 'Chargé de Clientèle Entreprises & PME',
    company: 'Banque Atlantique Togo',
    companyId: 'comp-2',
    companyLogo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=150&auto=format&fit=crop&q=80',
    location: 'Sokodé',
    workMode: 'Présentiel',
    contractType: 'CDI',
    industry: 'Banque & Finance',
    experienceLevel: 'Intermédiaire (2-5 ans)',
    salaryMin: 450000,
    salaryMax: 700000,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: 'Nouveau',
    postedDate: '2026-08-16',
    deadline: '2026-09-25',
    featured: false,
    applicantsCount: 15,
    viewsCount: 210,
    description: 'Affecté à l\'agence régionale de Sokodé, vous développerez et gérerez un portefeuille de clients PME/PMI et commerçants de la région Centrale, en leur apportant des solutions de financement adaptées.',
    responsibilities: [
      'Prospecter de nouvelles entreprises et commerçants de la région.',
      'Analyser les besoins d\'exploitation et d\'investissement et monter les dossiers de crédit.',
      'Assurer le suivi des comptes, la rentabilité du portefeuille et la maîtrise du risque client.'
    ],
    requirements: [
      'Bac+3/4 en Banque, Gestion commerciale, Finance ou Économie.',
      '2 ans d\'expérience minimum en banque commerciale.',
      'Aisance relationnelle, sens de la négociation et proactivité.'
    ],
    benefits: [
      'Commissions sur objectifs commerciaux',
      'Couverture santé à 100%',
      'Plan d\'épargne retraite entreprise'
    ]
  },
  {
    id: 'job-8',
    title: 'Développeur Mobile Flutter / React Native',
    company: 'TechHub Lomé',
    companyId: 'comp-1',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    location: 'Lomé',
    workMode: 'Télétravail',
    contractType: 'Freelance',
    industry: 'Informatique & Technologies',
    experienceLevel: 'Intermédiaire (2-5 ans)',
    salaryMin: 500000,
    salaryMax: 900000,
    salaryPeriod: 'mois',
    currency: 'FCFA',
    status: 'Ouvert',
    postedDate: '2026-08-11',
    deadline: '2026-09-18',
    featured: false,
    applicantsCount: 19,
    viewsCount: 310,
    description: 'Mission en freelance renouvelable pour développer des applications mobiles de paiement électronique et de livraison adaptées aux réseaux mobiles et smartphones d\'Afrique de l\'Ouest.',
    responsibilities: [
      'Développer des applications iOS et Android performantes et légères.',
      'Intégrer les passerelles de paiement Mobile Money (T-Money, Flooz) et cartes bancaires.',
      'Optimiser le fonctionnement hors ligne (offline-first caching) et la consommation de données.'
    ],
    requirements: [
      'Expérience confirmée sur Flutter ou React Native avec applications publiées sur les stores.',
      'Maîtrise de la gestion d\'état (Bloc, Redux, Zustand) et des API REST.',
      'Autonomie totale et rigueur dans le respect des jalons de livraison.'
    ],
    benefits: [
      '100% télétravail avec horaires flexibles',
      'Facturation mensuelle garantie et ponctuelle',
      'Possibilité d\'évolution vers un contrat CDI'
    ]
  }
];
