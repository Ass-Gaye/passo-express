require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const columns = await client.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'User' ORDER BY ordinal_position`
  );
  console.log('COLUMNS:', JSON.stringify(columns.rows, null, 2));

  const users = await client.query('SELECT * FROM "User" LIMIT 1');
  console.log('USER ROW:', JSON.stringify(users.rows, null, 2));

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});