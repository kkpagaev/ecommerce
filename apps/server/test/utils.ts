import { Pool, PoolClient } from "pg";

async function getTables(client: Pool) {
  const tables: { table_name: string }[] = await client.query(`
    SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
     AND table_type = 'BASE TABLE';
  `).then((res) => res.rows);

  return tables.map((t) => t.table_name);
}

async function createTempTable(pool: Pool, tables: string[]) {
  for (const table of tables) {
    await pool.query(`CREATE TEMPORARY TABLE ${table} (LIKE ${table} INCLUDING ALL)`);
  }
}

async function dropTables(pool: Pool, tables: string[]) {
  for (const table of tables) {
    await pool.query(`DROP TABLE ${table}`);
  }
}

export async function testDB() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://user:user@localhost:1252/user",
  });
  const client = await pool.connect();
  const tables = await getTables(pool);
  await createTempTable(pool, tables);

  return {
    pool,
    client,
    async [Symbol.asyncDispose]() {
      await dropTables(pool, tables);
      client.release();
      await pool.end();
    },
  };
}
