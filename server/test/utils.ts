import { Pool } from "pg";

export async function testDB() {
  const pool = new Pool({
    connectionString: "postgresql://user:user@localhost:1252/user",
  });
  const client = await pool.connect();
  await pool.query("START TRANSACTION;");

  return {
    pool,
    client,
    async [Symbol.asyncDispose]() {
      await pool.query("ROLLBACK;");
    },
  };
}
