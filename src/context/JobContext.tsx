import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, Application, CandidateProfile, Company, JobFilterState, ApplicationStatus, JobStatus } from '../types';
import { mockCandidateProfile } from '../data/mockCandidates';
import {
  getJobs,
  getCompanies,
  createJob,
  updateJob,
  deleteJob,
  getProfile,
  createProfile,
  updateProfile,
  uploadResume,
  getResumeDownloadUrl,
  uploadAvatar,
  getApplicationsForCandidate,
  getApplicationsForRecruiter,
  createApplication,
  updateApplicationStatusInAppwrite,
  createNotification,
  getCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
  uploadCompanyImage
} from '../lib/appwrite';
import { useAuth } from './AuthContext';

interface JobContextType {
  jobs: Job[];
  companies: Company[];
  applications: Application[];
  isApplicationsLoading: boolean;
  recruiterCompany: Company | null;
  isCompanyLoading: boolean;
  updateRecruiterCompany: (fields: Partial<Company>) => Promise<void>;
  uploadCompanyLogo: (file: File) => Promise<void>;
  uploadCompanyBanner: (file: File) => Promise<void>;
  candidateProfile: CandidateProfile;
  savedJobIds: string[];
  filters: JobFilterState;
  activeRole: 'candidate' | 'recruiter';
  isLoadingSimulation: boolean;
  isErrorSimulation: boolean;
  setActiveRole: (role: 'candidate' | 'recruiter') => void;
  setFilters: React.Dispatch<React.SetStateAction<JobFilterState>>;
  resetFilters: () => void;
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
addJob: (newJob: Omit<Job, 'id' | 'postedDate' | 'applicantsCount' | 'viewsCount'>) => Promise<Job>;
updateJob: (jobId: string, data: Partial<Job>) => Promise<Job>;
deleteJob: (jobId: string) => Promise<void>;
updateJobStatus: (jobId: string, status: JobStatus) => Promise<void>;
  addApplication: (jobId: string, coverLetter?: string, resumeName?: string) => Promise<Application>;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => Promise<void>;
  updateCandidateProfile: (profile: Partial<CandidateProfile>) => Promise<void>;
  uploadCandidateResume: (file: File) => Promise<void>;
  uploadCandidateAvatar: (file: File) => Promise<void>;
  getCandidateResumeUrl: () => string | null;
  isProfileLoading: boolean;
  setIsLoadingSimulation: (val: boolean) => void;
  setIsErrorSimulation: (val: boolean) => void;
}

const initialFilters: JobFilterState = {
  searchQuery: '',
  location: '',
  industry: '',
  contractType: '',
  workMode: '',
  experienceLevel: '',
  salaryMin: undefined
};

const JobContext = createContext<JobContextType | undefined>(undefined);

// L'attribut "website" est de type URL strict côté Appwrite : une chaîne
// vide est invalide. On le retire du payload tant qu'aucune vraie URL
// n'a été saisie.
function sanitizeCompanyPayload(fields: Record<string, any>): Record<string, any> {
  const result = { ...fields };
  if ('website' in result && !result.website) {
    delete result.website;
  }
  return result;
}

// Les champs "complexes" du profil (tableaux d'objets ou de chaînes) sont
// stockés côté Appwrite sous forme de texte JSON, car les attributs de
// table Appwrite sont plus simples à gérer en type "string".
const JSON_PROFILE_FIELDS = ['skills', 'experiences', 'education', 'languages', 'savedJobIds'] as const;

function serializeProfileForAppwrite(fields: Partial<CandidateProfile>): Record<string, any> {
  const result: Record<string, any> = { ...fields };
  for (const key of JSON_PROFILE_FIELDS) {
    if (key in fields) {
      result[key] = JSON.stringify((fields as any)[key] ?? []);
    }
  }
  return result;
}

function parseProfileFromAppwrite(row: any, fallback: CandidateProfile): CandidateProfile {
  const parseField = (key: string, defaultValue: any) => {
    if (row[key] === undefined || row[key] === null) return defaultValue;
    if (typeof row[key] !== 'string') return row[key];
    try {
      return JSON.parse(row[key]);
    } catch {
      return defaultValue;
    }
  };

  return {
    id: row.$id,
    fullName: row.fullName ?? fallback.fullName,
    title: row.title ?? fallback.title,
    location: row.location ?? fallback.location,
    email: row.email ?? fallback.email,
    phone: row.phone ?? fallback.phone,
    avatar: row.avatar ?? fallback.avatar,
    bio: row.bio ?? fallback.bio,
    experiences: parseField('experiences', []),
    education: parseField('education', []),
    skills: parseField('skills', []),
    languages: parseField('languages', []),
    resumeName: row.resumeName ?? undefined,
    resumeFileId: row.resumeFileId ?? undefined,
    savedJobIds: parseField('savedJobIds', [])
  };
}

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const { user } = useAuth();
const [jobs, setJobs] = useState<Job[]>([]);
const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState<boolean>(false);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(mockCandidateProfile);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(mockCandidateProfile.savedJobIds);
  const [filters, setFilters] = useState<JobFilterState>(initialFilters);
  const [activeRole, setActiveRole] = useState<'candidate' | 'recruiter'>('candidate');

  // Garde activeRole synchronisé avec le rôle réel du compte connecté
  useEffect(() => {
    if (user && user.role) {
      setActiveRole(user.role);
    }
  }, [user]);
  const [isLoadingSimulation, setIsLoadingSimulation] = useState<boolean>(false);
  const [isErrorSimulation, setIsErrorSimulation] = useState<boolean>(false);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);

  // Charge (ou crée) le profil candidat réel dès qu'un utilisateur est connecté
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        // Déconnecté : on repart d'un profil vide, pas du mock partagé
        setCandidateProfile({ ...mockCandidateProfile, id: '', fullName: '', email: '', skills: [], experiences: [], education: [], languages: [], savedJobIds: [] });
        setSavedJobIds([]);
        return;
      }

      setIsProfileLoading(true);
      try {
        const row = await getProfile(user.id);

        if (row) {
          const profile = parseProfileFromAppwrite(row, mockCandidateProfile);
          setCandidateProfile(profile);
          setSavedJobIds(profile.savedJobIds);
        } else {
          // Premier login : on crée un profil par défaut à partir du compte
          const defaultProfile: Omit<CandidateProfile, 'id'> = {
            fullName: user.name || '',
            title: 'Nouveau membre JobLink Togo',
            location: 'Lomé, Togo',
            email: user.email,
            phone: '',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            bio: '',
            experiences: [],
            education: [],
            skills: [],
            languages: [],
            savedJobIds: []
          };

          const created = await createProfile(user.id, serializeProfileForAppwrite(defaultProfile));
          const profile = parseProfileFromAppwrite(created, mockCandidateProfile);
          setCandidateProfile(profile);
          setSavedJobIds(profile.savedJobIds);
        }
      } catch (error) {
        console.error('Erreur chargement profil candidat :', error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Charge les vraies candidatures depuis Appwrite, selon le rôle
  useEffect(() => {
    const loadApplications = async () => {
      if (!user || !user.role) {
        setApplications([]);
        return;
      }

      setIsApplicationsLoading(true);
      try {
        const rows =
          user.role === 'candidate'
            ? await getApplicationsForCandidate(user.id)
            : await getApplicationsForRecruiter(user.id);

        const mapped: Application[] = rows.map((row: any) => ({
          id: row.$id,
          jobId: row.jobId,
          jobTitle: row.jobTitle,
          companyName: row.companyName,
          companyLogo: row.companyLogo || undefined,
          candidateId: row.candidateId,
          candidateName: row.candidateName,
          candidateEmail: row.candidateEmail,
          candidatePhone: row.candidatePhone,
          candidateAvatar: row.candidateAvatar || undefined,
          candidateTitle: row.candidateTitle,
          appliedDate: row.appliedDate,
          status: row.status,
          resumeName: row.resumeName || undefined,
          coverLetter: row.coverLetter || undefined,
          matchScore: row.matchScore || undefined,
          interviewDate: row.interviewDate || undefined,
          notes: row.notes || undefined
        }));

        setApplications(mapped);
      } catch (error) {
        console.error('Erreur chargement candidatures :', error);
      } finally {
        setIsApplicationsLoading(false);
      }
    };

    loadApplications();
  }, [user]);

  const [recruiterCompany, setRecruiterCompany] = useState<Company | null>(null);
  const [isCompanyLoading, setIsCompanyLoading] = useState<boolean>(false);

  function companyFromRow(row: any): Company {
    return {
      id: row.$id,
      ownerId: row.ownerId,
      name: row.name || '',
      tagline: row.tagline || '',
      logo: row.logo || '',
      banner: row.banner || '',
      industry: row.industry || '',
      location: row.location || '',
      address: row.address || '',
      website: row.website || '',
      size: row.size || '',
      foundedYear: row.foundedYear || '',
      about: row.about || '',
      values: row.values || [],
      activeJobsCount: row.activeJobsCount || 0
    };
  }

  // Charge (ou crée) la fiche entreprise du recruteur connecté
  useEffect(() => {
    const loadCompany = async () => {
      if (!user || user.role !== 'recruiter') {
        setRecruiterCompany(null);
        return;
      }

      setIsCompanyLoading(true);
      try {
        const row = await getCompanyProfile(user.id);

        if (row) {
          setRecruiterCompany(companyFromRow(row));
        } else {
          const defaultData = {
            name: user.name || 'Mon entreprise',
            tagline: '',
            logo: '',
            banner: '',
            industry: '',
            location: 'Lomé, Togo',
            address: '',
            website: '',
            size: '',
            foundedYear: '',
            about: '',
            values: [],
            activeJobsCount: 0
          };
          const created = await createCompanyProfile(user.id, sanitizeCompanyPayload(defaultData));
          setRecruiterCompany(companyFromRow(created));
        }
      } catch (error) {
        console.error('Erreur chargement fiche entreprise :', error);
      } finally {
        setIsCompanyLoading(false);
      }
    };

    loadCompany();
  }, [user]);

  const updateRecruiterCompany = async (fields: Partial<Company>) => {
    setRecruiterCompany((prev) => (prev ? { ...prev, ...fields } : prev));

    if (!user) return;

    try {
      await updateCompanyProfile(user.id, sanitizeCompanyPayload(fields));
    } catch (error: any) {
      if (error?.code === 404) {
        const created = await createCompanyProfile(user.id, sanitizeCompanyPayload({
          name: user.name || 'Mon entreprise',
          tagline: '',
          logo: '',
          banner: '',
          industry: '',
          location: 'Lomé, Togo',
          address: '',
          website: '',
          size: '',
          foundedYear: '',
          about: '',
          values: [],
          activeJobsCount: 0,
          ...fields
        }));
        setRecruiterCompany(companyFromRow(created));
        return;
      }
      console.error('Erreur sauvegarde fiche entreprise :', error);
      throw error;
    }
  };

  const uploadCompanyLogo = async (file: File) => {
    if (!user) throw new Error('Vous devez être connecté.');
    const url = await uploadCompanyImage(file, user.id);
    await updateRecruiterCompany({ logo: url });
  };

  const uploadCompanyBanner = async (file: File) => {
    if (!user) throw new Error('Vous devez être connecté.');
    const url = await uploadCompanyImage(file, user.id);
    await updateRecruiterCompany({ banner: url });
  };

useEffect(() => {
  const loadData = async () => {
    setIsLoadingSimulation(true);
    setIsErrorSimulation(false);

    let jobsLoaded = false;

    // ─── JOBS ─────────────────────────────────────
    try {
      const rows = await getJobs();

      const jobsFromAppwrite: Job[] = rows.map((row: any) => ({
        id: row.$id,
        ownerId: row.ownerId,
        title: row.title,
        company: row.company,
        companyId: row.companyId,
        companyLogo: row.companyLogo,
        location: row.location,
        workMode: row.workMode,
        contractType: row.contractType,
        industry: row.industry,
        experienceLevel: row.experienceLevel,
        salaryMin: row.salaryMin,
        salaryMax: row.salaryMax,
        salaryPeriod: row.salaryPeriod,
        currency: row.currency,
        status: row.status,
        postedDate: row.postedDate,
        deadline: row.deadline,
        description: row.description,
        responsibilities: row.responsibilities || [],
        requirements: row.requirements || [],
        benefits: row.benefits || [],
        featured: row.featured,
        applicantsCount: row.applicantsCount,
        viewsCount: row.viewsCount
      }));

      setJobs(jobsFromAppwrite);
      jobsLoaded = true;
    } catch (error) {
      console.error('Erreur chargement Jobs Appwrite:', error);
    }

    // ─── COMPANIES ────────────────────────────────
    try {
      const companyRows = await getCompanies();

      const companiesFromAppwrite: Company[] = companyRows.map((row: any) => ({
        id: row.$id,
        name: row.name,
        tagline: row.tagline,
        logo: row.logo,
        banner: row.banner,
        industry: row.industry,
        location: row.location,
        address: row.address,
        website: row.website,
        size: row.size,
        foundedYear: row.foundedYear,
        about: row.about,
        values: row.values || [],
        activeJobsCount: row.activeJobsCount || 0
      }));

      setCompanies(companiesFromAppwrite);
    } catch (error) {
      console.error('Erreur chargement Companies Appwrite:', error);
    }

    // Une erreur globale seulement si les Jobs eux-mêmes n'ont pas été chargés
    if (!jobsLoaded) {
      setIsErrorSimulation(true);
    }

    setIsLoadingSimulation(false);
  };

  loadData();
}, []);
  const resetFilters = () => {
    setFilters(initialFilters);
    setIsErrorSimulation(false);
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const updated = exists ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      setCandidateProfile((cp) => ({ ...cp, savedJobIds: updated }));

      if (user) {
        updateProfile(user.id, serializeProfileForAppwrite({ savedJobIds: updated })).catch((error) => {
          console.error('Erreur sauvegarde offre favorite :', error);
        });
      }

      return updated;
    });
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);
const addJob = async (
  newJobData: Omit<Job, 'id' | 'postedDate' | 'applicantsCount' | 'viewsCount'>
): Promise<Job> => {
  if (!user) {
    throw new Error('Vous devez être connecté en tant que recruteur pour publier une offre.');
  }

  const createdJob = await createJob(
    {
      ...newJobData,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      viewsCount: 1
    },
    user.id
  );

  const job = {
    ...createdJob,
    id: createdJob.$id
  } as unknown as Job;

  setJobs((prev) => [job, ...prev]);

  return job;
};

const handleUpdateJob = async (
  jobId: string,
  data: Partial<Job>
): Promise<Job> => {
  const updatedRow = await updateJob(jobId, data);

  const updatedJob = {
    ...updatedRow,
    id: updatedRow.$id
  } as unknown as Job;

  setJobs((prev) =>
    prev.map((job) => (job.id === jobId ? updatedJob : job))
  );

  return updatedJob;
};

const handleDeleteJob = async (jobId: string): Promise<void> => {
  await deleteJob(jobId);

  setJobs((prev) => prev.filter((job) => job.id !== jobId));
};
  const updateJobStatus = async (jobId: string, status: JobStatus) => {
    // Optimistic update : on met à jour l'affichage tout de suite
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );

    try {
      await updateJob(jobId, { status });
    } catch (error) {
      // En cas d'échec (ex: permissions), on annule le changement local
      console.error('Erreur mise à jour du statut :', error);
      setJobs((prev) =>
        prev.map((j) => {
          if (j.id !== jobId) return j;
          const previousStatus = status === 'Clôturé' ? 'Ouvert' : 'Clôturé';
          return { ...j, status: previousStatus };
        })
      );
      throw error;
    }
  };

  const addApplication = async (
    jobId: string,
    coverLetter?: string,
    resumeName?: string
  ): Promise<Application> => {
    const job = jobs.find((j) => j.id === jobId);

    if (!user) {
      throw new Error('Vous devez être connecté pour postuler.');
    }
    if (!job) {
      throw new Error('Offre introuvable.');
    }

    const payload = {
      jobId,
      jobTitle: job.title,
      companyName: job.company,
      companyLogo: job.companyLogo || '',
      candidateName: candidateProfile.fullName,
      candidateEmail: candidateProfile.email,
      candidatePhone: candidateProfile.phone,
      candidateAvatar: candidateProfile.avatar || '',
      candidateTitle: candidateProfile.title,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Nouveau' as ApplicationStatus,
      matchScore: Math.floor(Math.random() * 20) + 80,
      resumeName: resumeName || candidateProfile.resumeName || '',
      coverLetter: coverLetter || 'Candidature spontanée via JobLink Togo.'
    };

    const created = await createApplication(user.id, job.ownerId || '', payload);

    const newApp: Application = {
      id: created.$id,
      candidateId: user.id,
      ...payload
    };

    setApplications((prev) => [newApp, ...prev]);
    // Mise à jour locale (affichage immédiat pour le candidat) uniquement :
    // le candidat n'est pas propriétaire de l'offre et ne peut pas écrire
    // sur son compteur. Le vrai décompte, côté recruteur, est calculé
    // dynamiquement à partir des candidatures réelles (voir applicationsCountByJob).
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j))
    );

    // Notifie le recruteur propriétaire de l'offre (même s'il n'est pas connecté maintenant)
    if (job.ownerId) {
      createNotification(job.ownerId, {
        title: 'Nouvelle candidature reçue',
        message: `${candidateProfile.fullName} a postulé pour "${job.title}".`,
        type: 'application',
        link: '/recruteur/candidatures'
      }).catch((error) => {
        console.error('Erreur notification recruteur :', error);
      });
    }

    return newApp;
  };

  const updateApplicationStatus = async (appId: string, status: ApplicationStatus) => {
    const previousApp = applications.find((a) => a.id === appId);

    // Optimistic update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );

    try {
      await updateApplicationStatusInAppwrite(appId, status);

      // Notifie le candidat du changement de statut
      if (previousApp) {
        createNotification(previousApp.candidateId, {
          title: 'Mise à jour de votre candidature',
          message: `Votre candidature pour "${previousApp.jobTitle}" est maintenant : ${status}.`,
          type: 'application',
          link: '/candidat/candidatures'
        }).catch((error) => {
          console.error('Erreur notification candidat :', error);
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour statut candidature :', error);
      // On annule le changement local en cas d'échec
      if (previousApp) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: previousApp.status } : app))
        );
      }
      throw error;
    }
  };

  const updateCandidateProfile = async (updatedFields: Partial<CandidateProfile>) => {
    // Optimistic update
    setCandidateProfile((prev) => ({ ...prev, ...updatedFields }));

    if (!user) return;

    try {
      await updateProfile(user.id, serializeProfileForAppwrite(updatedFields));
    } catch (error: any) {
      // Cas rare : le profil n'a pas encore fini d'être créé (juste après
      // l'inscription). On le crée alors directement avec ces champs.
      if (error?.code === 404) {
        try {
          await createProfile(user.id, serializeProfileForAppwrite({
            fullName: user.name || '',
            email: user.email,
            phone: '',
            location: 'Lomé, Togo',
            title: '',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            bio: '',
            experiences: [],
            education: [],
            skills: [],
            languages: [],
            savedJobIds: [],
            ...updatedFields
          }));
          return;
        } catch (createError: any) {
          // Le profil a été créé entre-temps par l'autre chemin (chargement
          // initial) : on retente simplement la mise à jour.
          if (createError?.code === 409) {
            await updateProfile(user.id, serializeProfileForAppwrite(updatedFields));
            return;
          }
          console.error('Erreur création profil (fallback) :', createError);
          throw createError;
        }
      }
      console.error('Erreur sauvegarde profil candidat :', error);
      throw error;
    }
  };

  const uploadCandidateResume = async (file: File) => {
    if (!user) {
      throw new Error('Vous devez être connecté pour envoyer un CV.');
    }

    const uploaded = await uploadResume(file, user.id, candidateProfile.resumeFileId);

    await updateCandidateProfile({
      resumeName: file.name,
      resumeFileId: uploaded.$id
    });
  };

  const uploadCandidateAvatar = async (file: File) => {
    if (!user) {
      throw new Error('Vous devez être connecté pour changer votre photo de profil.');
    }

    const avatarUrl = await uploadAvatar(file, user.id);
    await updateCandidateProfile({ avatar: avatarUrl });
  };

  const getCandidateResumeUrl = (): string | null => {
    if (!candidateProfile.resumeFileId) return null;
    return getResumeDownloadUrl(candidateProfile.resumeFileId).toString();
  };

  return (
    <JobContext.Provider
      value={{
  jobs,
  companies,
  applications,
  isApplicationsLoading,
  recruiterCompany,
  isCompanyLoading,
  updateRecruiterCompany,
  uploadCompanyLogo,
  uploadCompanyBanner,
  candidateProfile,
  savedJobIds,
  filters,
  activeRole,
  isLoadingSimulation,
  isErrorSimulation,
  setActiveRole,
  setFilters,
  resetFilters,
  toggleSaveJob,
  isJobSaved,
  addJob,
  updateJob: handleUpdateJob,
  deleteJob: handleDeleteJob,
  updateJobStatus,
  addApplication,
  updateApplicationStatus,
  updateCandidateProfile,
  uploadCandidateResume,
  uploadCandidateAvatar,
  getCandidateResumeUrl,
  isProfileLoading,
  setIsLoadingSimulation,
  setIsErrorSimulation
}}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};
