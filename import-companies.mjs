import { Client, TablesDB, ID } from "node-appwrite";
import fs from "fs";

const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const tablesDB = new TablesDB(client);

const TABLE_ID = "companies";

console.log("\n🔥 JobLink Togo → Import des Companies\n");

const file = fs.readFileSync("./src/data/mockCompanies.ts", "utf8");

// Récupération des objets Company depuis le fichier TypeScript
const objectMatches = file.match(/\{\s*id:\s*'comp-[\s\S]*?\n  \}/g);

if (!objectMatches) {
  console.error("❌ Impossible de trouver les companies dans mockCompanies.ts");
  process.exit(1);
}

console.log(`📦 Companies trouvées dans mockCompanies.ts : ${objectMatches.length}\n`);

for (const objectText of objectMatches) {
  try {
    const get = (field) => {
      const regex = new RegExp(
        `${field}:\\s*'([^']*)'`
      );

      const match = objectText.match(regex);

      return match ? match[1] : "";
    };

    const getNumber = (field) => {
      const regex = new RegExp(`${field}:\\s*(\\d+)`);
      const match = objectText.match(regex);

      return match ? Number(match[1]) : 0;
    };

    const id = get("id");

    const company = {
      name: get("name"),
      tagline: get("tagline"),
      logo: get("logo"),
      banner: get("banner"),
      industry: get("industry"),
      location: get("location"),
      address: get("address"),
      website: get("website"),
      size: get("size"),
      foundedYear: get("foundedYear"),
      about: get("about"),
      values: [],
      activeJobsCount: getNumber("activeJobsCount")
    };

    // Récupération du tableau values
    const valuesMatch = objectText.match(
      /values:\s*\[([\s\S]*?)\],\s*activeJobsCount/
    );

    if (valuesMatch) {
      company.values = [
        ...valuesMatch[1].matchAll(/'([^']*)'/g)
      ].map((match) => match[1]);
    }

    if (!company.name) {
      throw new Error("Nom de l'entreprise introuvable");
    }

    try {
      await tablesDB.getRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: id
      });

      console.log(`↪️ ${id} → déjà présente : ${company.name}`);
      continue;

    } catch (error) {
      // La ligne n'existe probablement pas → on continue avec la création
    }

    await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId: id,
      data: company
    });

    console.log(`✅ ${id} → ${company.name}`);

  } catch (error) {
    console.error(`❌ Erreur : ${error.message}`);
  }
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 IMPORT COMPANIES TERMINÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);