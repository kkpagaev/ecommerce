import fp from "fastify-plugin";
import { Pool } from "pg";

declare module "fastify" {
  interface FastifyInstance {
    pool: Pool;
  }
}

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
