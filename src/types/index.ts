export type ContractType = 'CDI' | 'CDD' | 'Stage' | 'Freelance';
export type WorkMode = 'Présentiel' | 'Hybride' | 'Télétravail';
export type JobStatus = 'Ouvert' | 'Clôture bientôt' | 'Nouveau' | 'Clôturé';
export type ExperienceLevel = 'Tous' | 'Débutant (0-2 ans)' | 'Intermédiaire (2-5 ans)' | 'Senior (5+ ans)' | 'Lead / Direction';

export interface Job {
  id: string;
  ownerId?: string; // $id du compte Appwrite du recruteur qui a créé l'offre
  title: string;
  company: string;
  companyId: string;
  companyLogo: string;
  location: string; // Lomé, Kara, Sokodé, etc.
  workMode: WorkMode;
  contractType: ContractType;
  industry: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: 'mois' | 'an';
  currency?: string;
  status: JobStatus;
  postedDate: string;
  deadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  featured?: boolean;
  applicantsCount?: number;
  viewsCount?: number;
}

export type ApplicationStatus = 'Nouveau' | 'En attente' | 'En revue' | 'Entretien' | 'Retenu' | 'Refusé';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAvatar?: string;
  candidateTitle: string;
  appliedDate: string;
  status: ApplicationStatus;
  resumeName?: string;
  coverLetter?: string;
  matchScore?: number;
  interviewDate?: string;
  notes?: string;
}

export interface CandidateExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface CandidateEducation {
  id: string;
  degree: string;
  school: string;
  year: string;
  location?: string;
}

export interface CandidateLanguage {
  name: string;
  level: 'Débutant' | 'Intermédiaire' | 'Courant' | 'Langue maternelle';
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  experiences: CandidateExperience[];
  education: CandidateEducation[];
  skills: string[];
  languages: CandidateLanguage[];
  resumeName?: string;
  resumeFileId?: string; // ID du fichier dans Appwrite Storage (bucket resumes)
  savedJobIds: string[];
}

export interface Company {
  id: string;
  ownerId?: string; // $id du compte recruteur propriétaire de cette fiche
  name: string;
  tagline: string;
  logo: string;
  banner: string;
  industry: string;
  location: string;
  address: string;
  website: string;
  size: string;
  foundedYear: string;
  about: string;
  values: string[];
  activeJobsCount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'application' | 'interview' | 'job_alert' | 'system';
  link?: string;
}

export interface JobFilterState {
  searchQuery: string;
  location: string;
  industry: string;
  contractType: string;
  workMode: string;
  experienceLevel: string;
  salaryMin?: number;
}
