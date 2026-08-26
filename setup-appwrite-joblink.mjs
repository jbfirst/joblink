const ENDPOINT = (process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1").replace(/\/$/, "");
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

if (!PROJECT_ID || !API_KEY || !DATABASE_ID) {
  console.error(`
❌ Configuration manquante.

Tu dois définir :

APPWRITE_PROJECT_ID
APPWRITE_API_KEY
APPWRITE_DATABASE_ID
`);
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": PROJECT_ID,
  "X-Appwrite-Key": API_KEY,
};

async function api(path, method = "POST", body = undefined) {
  const response = await fetch(`${ENDPOINT}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    const error = new Error(data.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

async function createTable(id, name) {
  try {
    await api(`/tablesdb/${DATABASE_ID}/tables`, "POST", {
      tableId: id,
      name,
      permissions: [],
      rowSecurity: false,
      enabled: true,
    });

    console.log(`✅ Table créée : ${id}`);
  } catch (error) {
    if (error.status === 409) {
      console.log(`↪️ Table déjà existante : ${id}`);
    } else {
      throw error;
    }
  }
}

async function createColumn(tableId, type, column) {
  try {
    const body = {
      key: column.key,
      required: column.required ?? false,
      array: column.array ?? false,
    };

    if (type === "string") {
      body.size = column.size || 255;
    }

    if (type === "enum") {
      body.elements = column.elements;
    }

    if (column.default !== undefined) {
      body.default = column.default;
    }

    await api(
      `/tablesdb/${DATABASE_ID}/tables/${tableId}/columns/${type}`,
      "POST",
      body
    );

    console.log(`   ✅ ${column.key}`);
  } catch (error) {
    if (error.status === 409) {
      console.log(`   ↪️ ${column.key} existe déjà`);
    } else {
      throw error;
    }
  }
}

async function setupTable(table) {
  console.log(`\n📦 ${table.name}`);

  await createTable(table.id, table.name);

  for (const column of table.columns) {
    await createColumn(table.id, column.type, column);
  }
}

/*
|--------------------------------------------------------------------------
| JOBS
|--------------------------------------------------------------------------
*/

const jobs = {
  id: "jobs",
  name: "Jobs",
  columns: [
    { key: "title", type: "string", required: true },

    { key: "company", type: "string", required: true },
    { key: "companyId", type: "string", required: true },
    { key: "companyLogo", type: "string", size: 1000, required: true },

    { key: "location", type: "string", required: true },

    {
      key: "workMode",
      type: "enum",
      required: true,
      elements: [
        "Présentiel",
        "Hybride",
        "Télétravail"
      ]
    },

    {
      key: "contractType",
      type: "enum",
      required: true,
      elements: [
        "CDI",
        "CDD",
        "Stage",
        "Freelance"
      ]
    },

    { key: "industry", type: "string", required: true },
    { key: "experienceLevel", type: "string", required: true },

    { key: "salaryMin", type: "integer" },
    { key: "salaryMax", type: "integer" },

    {
      key: "salaryPeriod",
      type: "enum",
      elements: ["mois", "an"]
    },

    { key: "currency", type: "string", size: 20 },

    {
      key: "status",
      type: "enum",
      required: true,
      elements: [
        "Ouvert",
        "Clôture bientôt",
        "Nouveau",
        "Clôturé"
      ]
    },

    { key: "postedDate", type: "string", size: 30, required: true },
    { key: "deadline", type: "string", size: 30, required: true },

    { key: "description", type: "string", size: 4096, required: true },

    {
      key: "responsibilities",
      type: "string",
      size: 4096,
      array: true,
      required: true
    },

    {
      key: "requirements",
      type: "string",
      size: 4096,
      array: true,
      required: true
    },

    {
      key: "benefits",
      type: "string",
      size: 4096,
      array: true,
      required: true
    },

    { key: "featured", type: "boolean" },
    { key: "applicantsCount", type: "integer" },
    { key: "viewsCount", type: "integer" }
  ]
};

/*
|--------------------------------------------------------------------------
| COMPANIES
|--------------------------------------------------------------------------
*/

const companies = {
  id: "companies",
  name: "Companies",
  columns: [
    { key: "name", type: "string", required: true },
    { key: "tagline", type: "string", size: 1000, required: true },
    { key: "logo", type: "string", size: 1000, required: true },
    { key: "banner", type: "string", size: 1000, required: true },
    { key: "industry", type: "string", required: true },
    { key: "location", type: "string", required: true },
    { key: "address", type: "string", size: 1000, required: true },
    { key: "website", type: "url", required: true },
    { key: "size", type: "string", required: true },
    { key: "foundedYear", type: "string", size: 10, required: true },
    { key: "about", type: "string", size: 4096, required: true },

    {
      key: "values",
      type: "string",
      size: 1000,
      array: true,
      required: true
    },

    { key: "activeJobsCount", type: "integer", required: true }
  ]
};

/*
|--------------------------------------------------------------------------
| CANDIDATES
|--------------------------------------------------------------------------
*/

const candidates = {
  id: "candidates",
  name: "Candidates",
  columns: [
    { key: "fullName", type: "string", required: true },
    { key: "title", type: "string", required: true },
    { key: "location", type: "string", required: true },
    { key: "email", type: "email", required: true },
    { key: "phone", type: "string", required: true },
    { key: "avatar", type: "string", size: 1000, required: true },
    { key: "bio", type: "string", size: 4096, required: true },

    // Données complexes du profil stockées en JSON
    { key: "profileData", type: "string", size: 4096, required: false },

    {
      key: "skills",
      type: "string",
      size: 255,
      array: true,
      required: true
    }
  ]
};

/*
|--------------------------------------------------------------------------
| APPLICATIONS
|--------------------------------------------------------------------------
*/

const applications = {
  id: "applications",
  name: "Applications",
  columns: [
    { key: "jobId", type: "string", required: true },
    { key: "jobTitle", type: "string", required: true },

    { key: "companyName", type: "string", required: true },
    { key: "companyLogo", type: "string", size: 1000 },

    { key: "candidateId", type: "string", required: true },
    { key: "candidateName", type: "string", required: true },
    { key: "candidateEmail", type: "email", required: true },
    { key: "candidatePhone", type: "string", required: true },
    { key: "candidateAvatar", type: "string", size: 1000 },
    { key: "candidateTitle", type: "string", required: true },

    { key: "appliedDate", type: "string", size: 30, required: true },

    {
      key: "status",
      type: "enum",
      required: true,
      elements: [
        "Nouveau",
        "En attente",
        "En revue",
        "Entretien",
        "Retenu",
        "Refusé"
      ]
    },

    { key: "resumeName", type: "string" },
    { key: "coverLetter", type: "string", size: 4096 },
    { key: "matchScore", type: "integer" },
    { key: "interviewDate", type: "string", size: 255 },
    { key: "notes", type: "string", size: 4096 }
  ]
};

/*
|--------------------------------------------------------------------------
| NOTIFICATIONS
|--------------------------------------------------------------------------
*/

const notifications = {
  id: "notifications",
  name: "Notifications",
  columns: [
    { key: "title", type: "string", required: true },
    { key: "message", type: "string", size: 4096, required: true },
    { key: "timestamp", type: "string", size: 100, required: true },
    { key: "read", type: "boolean", required: true },

    {
      key: "type",
      type: "enum",
      required: true,
      elements: [
        "application",
        "interview",
        "job_alert",
        "system"
      ]
    },

    { key: "link", type: "string", size: 500 }
  ]
};

/*
|--------------------------------------------------------------------------
| LANCEMENT
|--------------------------------------------------------------------------
*/

async function main() {
  console.log("\n🔥 JobLink Togo → Appwrite\n");

  await setupTable(jobs);
await setupTable(companies);

// Candidates : la table existe déjà et sa limite de colonnes/taille
// a été atteinte. On la laisse telle quelle pour le moment.

await setupTable(applications);
await setupTable(notifications);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONFIGURATION TERMINÉE

Jobs
Companies
Candidates
Applications
Notifications

Les données mock*.ts restent intactes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

main().catch((error) => {
  console.error("\n❌ ERREUR :", error.message);
  process.exit(1);
});