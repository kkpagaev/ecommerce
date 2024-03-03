import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Categories } from "../core/catalog/category";
import { Products } from "../core/catalog/product";
import { Attributes } from "../core/catalog/attribute";

type Catalog = {
  categories: Categories;
  products: Products;
  attributes: Attributes;
};

declare module "fastify" {
  export interface FastifyInstance {
    catalog: Catalog;
  }
}

export default fp(async function (f: FastifyInstance) {
  const categories = Categories(f);
  const products = Products(f);
  const attributes = Attributes(f);

  f.decorate("catalog", {
    categories: categories,
    products: products,
    attributes: attributes,
  });
}, {
  dependencies: ["pool", "zod"],
});
