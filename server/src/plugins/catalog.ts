import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Categories } from "../core/catalog/category";
import { Products } from "../core/catalog/product";

type Catalog = {
  categories: Categories;
};

declare module "fastify" {
  export interface FastifyInstance {
    catalog: Catalog;
  }
}

export default fp(async function (f: FastifyInstance) {
  const categories = Categories(f);
  const products = Products(f);

  f.decorate("catalog", {
    categories: categories,
    products: products,
  });
}, {
  dependencies: ["pool", "zod"],
});
