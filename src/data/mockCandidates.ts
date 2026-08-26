import { CandidateProfile } from '../types';

export const mockCandidateProfile: CandidateProfile = {
  id: 'cand-1',
  fullName: 'Koffi Mensah',
  title: 'Développeur Full Stack Senior',
  location: 'Lomé, Togo',
  email: 'koffi.mensah@email.tg',
  phone: '+228 90 12 34 56',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Ingénieur logiciel passionné avec plus de 6 ans d\'expérience dans le développement d\'applications web et mobiles modernes en Afrique de l\'Ouest. Spécialisé dans l\'écosystème TypeScript, React, Node.js et les architectures cloud.',
  experiences: [
    {
      id: 'exp-1',
      role: 'Lead Frontend Developer',
      company: 'Digital Solutions Togo',
      location: 'Lomé',
      startDate: '2022',
      endDate: 'Présent',
      current: true,
      description: 'Direction technique de l\'équipe frontend (4 développeurs). Refonte complète de la plateforme e-banking avec React, Next.js et Tailwind CSS, réduisant le temps de chargement de 40%.'
    },
    {
      id: 'exp-2',
      role: 'Développeur Full Stack',
      company: 'AfrikTech Innovation',
      location: 'Lomé',
      startDate: '2019',
      endDate: '2022',
      current: false,
      description: 'Développement d\'API REST sécurisées et d\'applications web en Node.js, Express, React et PostgreSQL. Intégration de passerelles de paiement T-Money et Flooz.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Master en Ingénierie Logicielle & Systèmes d\'Information',
      school: 'Université de Lomé (FDS / CIC)',
      year: '2019',
      location: 'Lomé, Togo'
    },
    {
      id: 'edu-2',
      degree: 'Licence en Informatique Fondamentale',
      school: 'IAEC Togo',
      year: '2017',
      location: 'Lomé, Togo'
    }
  ],
  skills: [
    'React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS',
    'PostgreSQL', 'Docker', 'GraphQL', 'REST API', 'Git & CI/CD',
    'Méthodologie Agile / Scrum'
  ],
  languages: [
    { name: 'Français', level: 'Langue maternelle' },
    { name: 'Anglais', level: 'Courant' },
    { name: 'Ewé', level: 'Langue maternelle' },
    { name: 'Kabyè', level: 'Intermédiaire' }
  ],
  resumeName: 'CV_Koffi_Mensah_FullStack.pdf',
  savedJobIds: ['job-1', 'job-2', 'job-5']
};

export const mockRecruiterCandidates = [
  {
    id: 'cand-1',
    fullName: 'Koffi Mensah',
    title: 'Senior Full Stack Developer',
    location: 'Lomé, Togo',
    email: 'koffi.mensah@email.tg',
    phone: '+228 90 12 34 56',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    experience: '6 ans',
    education: 'Master Génie Logiciel - Université de Lomé',
    matchScore: 96,
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker']
  },
  {
    id: 'cand-2',
    fullName: 'Afiwa Lawson',
    title: 'Analyste Financière & Risques',
    location: 'Lomé, Togo',
    email: 'afiwa.lawson@email.tg',
    phone: '+228 91 45 67 89',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    experience: '4 ans',
    education: 'Master Finance - ESGIS Lomé',
    matchScore: 92,
    skills: ['Modélisation financière', 'SYSCOHADA', 'Audit', 'Excel VBA']
  },
  {
    id: 'cand-3',
    fullName: 'Kodjo Amégan',
    title: 'Ingénieur Travaux Publics',
    location: 'Kara, Togo',
    email: 'kodjo.amegan@email.tg',
    phone: '+228 92 88 99 00',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    experience: '3 ans',
    education: 'Ingénieur Génie Civil - ENSI Lomé',
    matchScore: 88,
    skills: ['AutoCAD', 'Gestion de chantier', 'Béton armé', 'Topographie']
  },
  {
    id: 'cand-4',
    fullName: 'Akouvi Dosseh',
    title: 'UI/UX & Product Designer',
    location: 'Lomé, Togo',
    email: 'akouvi.dosseh@email.tg',
    phone: '+228 93 11 22 33',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    experience: '3 ans',
    education: 'Licence Design Multimédia - Université de Lomé',
    matchScore: 95,
    skills: ['Figma', 'User Research', 'Design System', 'Prototypage']
  },
  {
    id: 'cand-5',
    fullName: 'Komlan Sossou',
    title: 'Coordinateur Logistique Portuaire',
    location: 'Lomé, Togo',
    email: 'komlan.sossou@email.tg',
    phone: '+228 96 33 44 55',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    experience: '5 ans',
    education: 'Master Logistique & Douane - ISICA',
    matchScore: 90,
    skills: ['Transit douanier', 'SEGUCE', 'Fret maritime', 'Gestion de flotte']
  }
];
