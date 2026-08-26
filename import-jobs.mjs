import { Client, TablesDB, ID } from "appwrite";
import fs from "fs";

const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TABLE_ID = "jobs";

if (!PROJECT_ID || !DATABASE_ID) {
  console.error("❌ Variables Appwrite manquantes.");
  console.error("Vérifie APPWRITE_PROJECT_ID et APPWRITE_DATABASE_ID.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const tablesDB = new TablesDB(client);

/*
 * On récupère mockJobs.ts et on extrait uniquement le tableau.
 * Le fichier est du TypeScript, mais sa structure de données
 * est compatible avec l'évaluation JavaScript après quelques
 * petites transformations.
 */
const source = fs.readFileSync("./src/data/mockJobs.ts", "utf8");

let jobsCode = source
  .replace(/^import[\s\S]*?;\s*/, "")
  .replace(/export const mockJobs: Job\[\]\s*=/, "const mockJobs =");

const tempFile = "./.tmp-mockJobs.mjs";

fs.writeFileSync(
  tempFile,
  `${jobsCode}\nexport { mockJobs };`,
  "utf8"
);

const { mockJobs } = await import(
  new URL("./.tmp-mockJobs.mjs", import.meta.url).href
);

console.log("\n🔥 JobLink Togo → Import des Jobs\n");
console.log(`📦 Jobs trouvés dans mockJobs.ts : ${mockJobs.length}\n`);

let success = 0;
let skipped = 0;

for (const job of mockJobs) {
  try {
    const row = {
      title: job.title,
      company: job.company,
      companyId: job.companyId,
      companyLogo: job.companyLogo,
      location: job.location,
      workMode: job.workMode,
      contractType: job.contractType,
      industry: job.industry,
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryMin ?? null,
      salaryMax: job.salaryMax ?? null,
      salaryPeriod: job.salaryPeriod ?? null,
      currency: job.currency ?? null,
      status: job.status,
      postedDate: job.postedDate,
      deadline: job.deadline,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      benefits: job.benefits,
      featured: job.featured ?? false,
      applicantsCount: job.applicantsCount ?? 0,
      viewsCount: job.viewsCount ?? 0,
    };

    await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId: job.id || ID.unique(),
      data: row,
    });

    console.log(`✅ ${job.id} → ${job.title}`);
    success++;
  } catch (error) {
    if (
      error?.message?.toLowerCase().includes("already exists") ||
      error?.code === 409
    ) {
      console.log(`↪️ ${job.id} existe déjà`);
      skipped++;
    } else {
      console.error(`❌ ${job.id} → ${error.message}`);
    }
  }
}

fs.unlinkSync(tempFile);

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔥 IMPORT TERMINÉ");
console.log(`✅ Importés : ${success}`);
console.log(`↪️ Déjà présents : ${skipped}`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");