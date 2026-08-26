import { Client, TablesDB } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);

try {
  const result = await tablesDB.listRows({
    databaseId: process.env.APPWRITE_DATABASE_ID,
    tableId: 'companies'
  });

  console.log('\n🏢 ENTREPRISES APPWRITE\n');

  for (const company of result.rows) {
    console.log(`${company.$id} → ${company.name}`);
  }

  console.log(`\nTotal : ${result.rows.length}`);
} catch (error) {
  console.error('❌', error.message);
}