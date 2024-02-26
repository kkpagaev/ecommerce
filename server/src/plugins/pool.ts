import fp from "fastify-plugin";
import { Pool, PoolClient } from "pg";

declare module "fastify" {
  interface FastifyInstance {
    pool: Pool;
  }
}

export async function tx<T>(pool: Pool, callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    try {
      const res = await callback(client);
      await client.query("COMMIT");
      return res;
    }
    catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  }
  finally {
    client.release();
  }
};

export default fp(async function (f) {
  const pool = new Pool({
    connectionString: "postgresql://user:user@localhost:1252/user",
  });
  await pool.connect();

  f.decorate("pool", pool);

  f.addHook("onClose", async () => {
    await pool.end();
  });
}, {
  name: "pool",
});
