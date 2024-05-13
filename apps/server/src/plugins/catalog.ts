import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Categories, Vendors, Products, ProductFiltering, Attributes, AttributeGroups, Options, OptionGroups, ProductVariants } from "@repo/catalog";

type Catalog = {
  categories: Categories;
  vendors: Vendors;
  products: Products;
  attributes: Attributes;
  attributeGroups: AttributeGroups;
  options: Options;
  optionGroups: OptionGroups;
  productVariants: ProductVariants;
  productFiltering: ProductFiltering;
};

declare module "fastify" {
  export interface FastifyInstance {
    catalog: Catalog;
  }
}

export default fp(async function (f: FastifyInstance) {
  const categories = new Categories({ pool: f.pool });
  const products = new Products({ pool: f.pool });
  const attributes = new Attributes({ pool: f.pool });
  const attributeGroups = new AttributeGroups({ pool: f.pool });
  const options = new Options({ pool: f.pool });
  const optionGroups = new OptionGroups({ pool: f.pool });
  const productVariants = new ProductVariants({ pool: f.pool });
  const productFiltering = new ProductFiltering({ pool: f.pool });
  const vendors = new Vendors({ pool: f.pool });

  f.decorate("catalog", {
    categories: categories,
    products: products,
    attributes: attributes,
    attributeGroups: attributeGroups,
    options: options,
    vendors: vendors,
    optionGroups: optionGroups,
    productVariants: productVariants,
    productFiltering: productFiltering,
  });
}, {
  dependencies: ["pool", "zod"],
});
