import { Client, TablesDB } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID);

const tablesDB = new TablesDB(client);

try {
  const result = await tablesDB.listRows({
    databaseId: "joblink_togo",
    tableId: "jobs",
  });

  console.log("\n🔥 CONNEXION APPWRITE RÉUSSIE !");
  console.log("Nombre de jobs :", result.total);
  console.log("Lignes :", result.rows);
} catch (error) {
  console.error("\n❌ CONNEXION APPWRITE ÉCHOUÉE !");
  console.error(error.message);
}