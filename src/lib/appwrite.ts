import { Client, TablesDB, Account, Storage, ID, Permission, Role, Query } from "appwrite";

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const APPWRITE_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const JOBS_TABLE_ID = "jobs";
export const COMPANIES_TABLE_ID = "companies";
export const PROFILES_TABLE_ID = "profiles";
export const NOTIFICATIONS_TABLE_ID = "notifications";
export const APPLICATIONS_TABLE_ID = "applications";
export const RESUMES_BUCKET_ID = "6a89c2f000028da5c0f7";
// Plan gratuit Appwrite = 3 buckets max, donc on réutilise le même bucket
// que les CV pour les photos de profil (juste des types de fichiers différents).
export const AVATARS_BUCKET_ID = RESUMES_BUCKET_ID;

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const tablesDB = new TablesDB(client);
export const account = new Account(client);
export const storage = new Storage(client);

// ===============================
// AUTHENTIFICATION (Account API)
// ===============================
// Le rôle (candidat / recruteur) est stocké dans les préférences
// du compte Appwrite (account.prefs.role), car Appwrite Account
// n'a pas de champ "rôle" natif.

export type UserRole = "candidate" | "recruiter";

export async function registerAccount(
  email: string,
  password: string,
  name: string,
  role: UserRole
) {
  // 1. Créer le compte
  await account.create({
    userId: ID.unique(),
    email,
    password,
    name,
  });

  // 2. Ouvrir une session (connexion automatique après inscription)
  await account.createEmailPasswordSession({ email, password });

  // 3. Enregistrer le rôle dans les préférences du compte
  await account.updatePrefs({ prefs: { role } });

  return account.get();
}

export async function loginAccount(email: string, password: string) {
  await account.createEmailPasswordSession({ email, password });
  return account.get();
}

export async function logoutAccount() {
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch (error) {
    // Si aucune session n'existe déjà, on ignore l'erreur
    console.warn("Aucune session active à supprimer :", error);
  }
}

export async function getCurrentAccount() {
  try {
    return await account.get();
  } catch {
    // Pas connecté
    return null;
  }
}

export async function changeAccountPassword(
  newPassword: string,
  oldPassword: string
) {
  return account.updatePassword({ password: newPassword, oldPassword });
}

export async function setAccountRole(role: UserRole) {
  return account.updatePrefs({ prefs: { role } });
}

/**
 * Lance la connexion via Google. L'utilisateur est redirigé hors de
 * l'application, puis ramené sur `successUrl` (ou `failureUrl` en cas
 * d'échec). Cette fonction ne retourne rien : elle déclenche une
 * redirection complète du navigateur.
 */
export function loginWithGoogle() {
  const successUrl = `${window.location.origin}/auth/callback`;
  const failureUrl = `${window.location.origin}/connexion`;

  account.createOAuth2Session({
    provider: "google" as any,
    success: successUrl,
    failure: failureUrl,
  });
}

// ===============================
// JOBS
// ===============================

export async function getJobs() {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: JOBS_TABLE_ID,
    });

    return result.rows;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des offres :", error);
    throw error;
  }
}

export async function createJob(data: Record<string, any>, ownerId: string) {
  try {
    const result = await tablesDB.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: JOBS_TABLE_ID,
      rowId: ID.unique(),
      data: { ...data, ownerId },
      // Permissions posées au niveau du document (nécessite que
      // "Document Security" soit activé sur la table jobs) :
      // - tout le monde peut lire l'offre
      // - seul le recruteur propriétaire peut la modifier/supprimer
      permissions: [
        Permission.read(Role.any()),
        Permission.update(Role.user(ownerId)),
        Permission.delete(Role.user(ownerId)),
      ],
    });

    console.log("✅ Offre créée dans Appwrite :", result);

    return result;
  } catch (error) {
    console.error("❌ Erreur création offre :", error);
    throw error;
  }
}

export async function updateJob(
  jobId: string,
  data: Record<string, any>
) {
  try {
    const result = await tablesDB.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: JOBS_TABLE_ID,
      rowId: jobId,
      data,
    });

    console.log("✅ Offre mise à jour dans Appwrite :", result);

    return result;
  } catch (error) {
    console.error("❌ Erreur mise à jour offre :", error);
    throw error;
  }
}

export async function deleteJob(jobId: string) {
  try {
    await tablesDB.deleteRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: JOBS_TABLE_ID,
      rowId: jobId,
    });

    console.log("🗑️ Offre supprimée dans Appwrite :", jobId);

    return true;
  } catch (error) {
    console.error("❌ Erreur suppression offre :", error);
    throw error;
  }
}

// ===============================
// COMPANIES
// ===============================

export async function getCompanies() {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: COMPANIES_TABLE_ID,
    });

    return result.rows;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des entreprises :", error);
    throw error;
  }
}

// ===============================
// PROFILS CANDIDATS
// ===============================
// Un profil = une ligne dans la table "profiles", dont l'ID de ligne
// (rowId) est directement l'ID du compte Appwrite (user.$id).
// Cela évite d'avoir à faire une recherche : on sait toujours où lire.

export async function getProfile(userId: string) {
  try {
    return await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: PROFILES_TABLE_ID,
      rowId: userId,
    });
  } catch (error: any) {
    // 404 = le profil n'existe pas encore, ce n'est pas une vraie erreur
    if (error?.code === 404) return null;
    console.error("❌ Erreur lors du chargement du profil :", error);
    throw error;
  }
}

export async function createProfile(userId: string, data: Record<string, any>) {
  try {
    const result = await tablesDB.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: PROFILES_TABLE_ID,
      rowId: userId,
      data,
      permissions: [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });

    console.log("✅ Profil candidat créé :", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur création profil :", error);
    throw error;
  }
}

export async function updateProfile(userId: string, data: Record<string, any>) {
  try {
    const result = await tablesDB.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: PROFILES_TABLE_ID,
      rowId: userId,
      data,
    });

    console.log("✅ Profil candidat mis à jour :", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur mise à jour profil :", error);
    throw error;
  }
}

// ===============================
// CV (Appwrite Storage)
// ===============================

export async function uploadResume(file: File, userId: string, previousFileId?: string) {
  try {
    const uploaded = await storage.createFile({
      bucketId: RESUMES_BUCKET_ID,
      fileId: ID.unique(),
      file,
      permissions: [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });

    // On supprime l'ancien fichier après succès de l'upload du nouveau,
    // pour ne pas se retrouver sans CV si l'upload échoue en cours de route.
    if (previousFileId) {
      try {
        await storage.deleteFile({ bucketId: RESUMES_BUCKET_ID, fileId: previousFileId });
      } catch (cleanupError) {
        console.warn("Impossible de supprimer l'ancien CV :", cleanupError);
      }
    }

    console.log("✅ CV téléversé :", uploaded);
    return uploaded;
  } catch (error) {
    console.error("❌ Erreur envoi du CV :", error);
    throw error;
  }
}

export function getResumeDownloadUrl(fileId: string) {
  return storage.getFileDownload({ bucketId: RESUMES_BUCKET_ID, fileId });
}

// ===============================
// PHOTO DE PROFIL (Appwrite Storage)
// ===============================

export async function uploadAvatar(file: File, userId: string) {
  try {
    const uploaded = await storage.createFile({
      bucketId: AVATARS_BUCKET_ID,
      fileId: ID.unique(),
      file,
      permissions: [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });

    // URL directement affichable dans une balise <img>
    const viewUrl = storage.getFileView({ bucketId: AVATARS_BUCKET_ID, fileId: uploaded.$id });

    console.log("✅ Photo de profil téléversée :", uploaded);
    return viewUrl.toString();
  } catch (error) {
    console.error("❌ Erreur envoi photo de profil :", error);
    throw error;
  }
}

// ===============================
// NOTIFICATIONS
// ===============================
// Chaque notification appartient à un utilisateur (ownerId). On les
// récupère triées par date de création décroissante.

export async function getNotifications(userId: string) {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: NOTIFICATIONS_TABLE_ID,
      queries: [
        Query.equal("ownerId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ],
    });

    return result.rows;
  } catch (error) {
    console.error("❌ Erreur chargement notifications :", error);
    throw error;
  }
}

export async function createNotification(userId: string, data: Record<string, any>) {
  try {
    // Idem : impossible d'accorder une permission au destinataire (userId)
    // si ce n'est pas soi-même qui crée la notification (ex: le candidat
    // qui notifie le recruteur). On repose sur la permission "Users" de
    // la table + le filtrage par ownerId côté requête.
    const result = await tablesDB.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: NOTIFICATIONS_TABLE_ID,
      rowId: ID.unique(),
      data: { ...data, ownerId: userId, timestamp: new Date().toISOString() },
    });

    return result;
  } catch (error) {
    console.error("❌ Erreur création notification :", error);
    throw error;
  }
}

export async function markNotificationAsRead(rowId: string) {
  try {
    return await tablesDB.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: NOTIFICATIONS_TABLE_ID,
      rowId,
      data: { read: true },
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour notification :", error);
    throw error;
  }
}

// ===============================
// CANDIDATURES (APPLICATIONS)
// ===============================
// Chaque candidature référence à la fois le candidat (candidateId) et
// le propriétaire de l'offre (jobOwnerId), pour permettre à chacun de
// lire les candidatures qui le concernent, sans voir celles des autres.

export async function getApplicationsForCandidate(candidateId: string) {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPLICATIONS_TABLE_ID,
      queries: [
        Query.equal("candidateId", candidateId),
        Query.orderDesc("$createdAt"),
      ],
    });
    return result.rows;
  } catch (error) {
    console.error("❌ Erreur chargement candidatures (candidat) :", error);
    throw error;
  }
}

export async function getApplicationsForRecruiter(jobOwnerId: string) {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPLICATIONS_TABLE_ID,
      queries: [
        Query.equal("jobOwnerId", jobOwnerId),
        Query.orderDesc("$createdAt"),
      ],
    });
    return result.rows;
  } catch (error) {
    console.error("❌ Erreur chargement candidatures (recruteur) :", error);
    throw error;
  }
}

export async function createApplication(
  candidateId: string,
  jobOwnerId: string,
  data: Record<string, any>
) {
  try {
    // Note : un compte ne peut accorder une permission qu'à lui-même
    // depuis le SDK client (pas à un autre utilisateur comme jobOwnerId).
    // La lecture par le recruteur repose donc sur la permission "Users"
    // définie au niveau de la table, combinée au filtrage par requête
    // (Query.equal) côté code.
    const result = await tablesDB.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPLICATIONS_TABLE_ID,
      rowId: ID.unique(),
      data: { ...data, candidateId, jobOwnerId },
      permissions: [Permission.read(Role.user(candidateId))],
    });
    return result;
  } catch (error) {
    console.error("❌ Erreur création candidature :", error);
    throw error;
  }
}

export async function updateApplicationStatusInAppwrite(
  applicationRowId: string,
  status: string
) {
  try {
    return await tablesDB.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPLICATIONS_TABLE_ID,
      rowId: applicationRowId,
      data: { status },
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour statut candidature :", error);
    throw error;
  }
}

// ===============================
// FICHE ENTREPRISE (RECRUTEUR)
// ===============================
// Comme pour les profils candidats : une fiche = une ligne dans
// "companies", dont l'ID de ligne est directement l'ID du compte
// recruteur (ownerId), pour un accès direct sans recherche.

export async function getCompanyProfile(ownerId: string) {
  try {
    return await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: COMPANIES_TABLE_ID,
      rowId: ownerId,
    });
  } catch (error: any) {
    if (error?.code === 404) return null;
    console.error("❌ Erreur chargement fiche entreprise :", error);
    throw error;
  }
}

export async function createCompanyProfile(ownerId: string, data: Record<string, any>) {
  try {
    const result = await tablesDB.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: COMPANIES_TABLE_ID,
      rowId: ownerId,
      data: { ...data, ownerId },
      permissions: [
        Permission.read(Role.any()),
        Permission.update(Role.user(ownerId)),
        Permission.delete(Role.user(ownerId)),
      ],
    });
    return result;
  } catch (error) {
    console.error("❌ Erreur création fiche entreprise :", error);
    throw error;
  }
}

export async function updateCompanyProfile(ownerId: string, data: Record<string, any>) {
  try {
    const result = await tablesDB.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: COMPANIES_TABLE_ID,
      rowId: ownerId,
      data,
    });
    return result;
  } catch (error) {
    console.error("❌ Erreur mise à jour fiche entreprise :", error);
    throw error;
  }
}

export async function uploadCompanyImage(file: File, userId: string) {
  try {
    const uploaded = await storage.createFile({
      bucketId: RESUMES_BUCKET_ID, // bucket partagé (limite de 3 buckets sur le plan gratuit)
      fileId: ID.unique(),
      file,
      permissions: [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });

    return storage.getFileView({ bucketId: RESUMES_BUCKET_ID, fileId: uploaded.$id }).toString();
  } catch (error) {
    console.error("❌ Erreur envoi image entreprise :", error);
    throw error;
  }
}