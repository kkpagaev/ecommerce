import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Categories } from "../core/catalog/category";

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
