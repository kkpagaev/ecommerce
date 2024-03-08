import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Categories, Products, Attributes, AttributeGroups, Options, OptionGroups } from "@repo/catalog";

type Catalog = {
  categories: Categories;
  products: Products;
  attributes: Attributes;
  attributeGroups: AttributeGroups;
  options: Options;
  optionGroups: OptionGroups;
};

declare module "fastify" {
  export interface FastifyInstance {
    catalog: Catalog;
  }
}

export default fp(async function (f: FastifyInstance) {
  const categories = new Categories(f);
  const products = new Products(f);
  const attributes = new Attributes(f);
  const attributeGroups = new AttributeGroups(f);
  const options = new Options(f);
  const optionGroups = new OptionGroups(f);

  f.decorate("catalog", {
    categories: categories,
    products: products,
    attributes: attributes,
    attributeGroups: attributeGroups,
    options: options,
    optionGroups: optionGroups,
  });
}, {
  dependencies: ["pool", "zod"],
});
