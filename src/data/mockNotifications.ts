import { AppNotification } from '../types';

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Entretien programmé !',
    message: 'TechHub Lomé a programmé un entretien technique le 22 août à 10h00 pour le poste de Senior Full Stack Developer.',
    timestamp: 'Il y a 2 heures',
    read: false,
    type: 'interview',
    link: '/candidat/candidatures'
  },
  {
    id: 'notif-2',
    title: 'Candidature consultée',
    message: 'Banque Atlantique Togo a examiné votre dossier pour le poste "Analyste Financier Senior".',
    timestamp: 'Hier à 15:30',
    read: false,
    type: 'application',
    link: '/candidat/candidatures'
  },
  {
    id: 'notif-3',
    title: 'Nouvelle offre correspondant à votre profil',
    message: 'Une nouvelle offre "Développeur Mobile Flutter" à Lomé pourrait vous intéresser.',
    timestamp: 'Il y a 2 jours',
    read: true,
    type: 'job_alert',
    link: '/offres/job-8'
  },
  {
    id: 'notif-4',
    title: 'Bienvenue sur JobLink Togo',
    message: 'Complétez votre profil pour maximiser votre visibilité auprès des recruteurs togolais.',
    timestamp: 'Il y a 3 jours',
    read: true,
    type: 'system',
    link: '/candidat/profil'
  }
];
