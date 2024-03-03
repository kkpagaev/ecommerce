import { Pool } from "pg";

async function getTables(client) {
  /** @type {{table_name: string}[]} **/
  const tables = await client.query(`
    SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
     AND table_type = 'BASE TABLE';
  `).then((res) => res.rows);

  return tables.map((t) => t.table_name);
}

/**
 * @param {Pool} pool
 * @param {string[]} tables
 */
async function createTempTable(pool, tables) {
  for (const table of tables) {
    await pool.query(`CREATE TEMPORARY TABLE ${table} (LIKE ${table} INCLUDING ALL)`);
  }
}

/**
  * @param {Pool} pool
  * @param {string[]} tables
  */
async function dropTables(pool, tables) {
  for (const table of tables) {
    await pool.query(`DROP TABLE ${table}`);
  }
}

/**
 * @param {string} url
 */
export async function testDB(url) {
  const pool = new Pool({
    connectionString: url,
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

