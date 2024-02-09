import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";

type Categories = ReturnType<typeof Categories>;
function Categories(f: { pool: Pool }) {
  return {
    listCategories: listCategories.bind(null, f.pool),
  };
}

async function listCategories(pool: Pool, limit: number) {
  const res = await pool.query("SELECT * FROM categories LIMIT $1", [limit]);

  return res;
}

type Catalog = {
  categories: Categories;
};

declare module "fastify" {
  export interface FastifyInstance {
    catalog: Catalog;
  }
}

export default fp(async function (f: FastifyInstance) {
  const categories = Categories({ pool: f.pool });

  f.decorate("catalog", {
    categories: categories,
  });
}, {
  dependencies: ["pool", "zod"],
});
