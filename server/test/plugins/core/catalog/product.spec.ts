import { describe, expect, it } from "vitest";
import { testDB } from "../../../utils";
import { Products } from "../../../../src/core/catalog/product";
import { catalogQueries as q } from "../../../../src/core/catalog/queries";
import { PoolClient } from "pg";

async function createProducts() {
  const db = await testDB();
  const products = Products({ pool: db.pool });

  return {
    products,
    db,
    [Symbol.asyncDispose]: db[Symbol.asyncDispose],
  };
}

async function fixture(client: PoolClient) {
  const catId = await q.category.create.run({
    name: { uk: "test" },
    slug: "test",
  }, client).then((res) => res[0].id);
  const attributes = await q.attribute.create.run({
    values: [{
      name: { uk: "test" },
      description: { uk: "test" },
    },
    {
      name: { uk: "test2" },
      description: { uk: "test2" },
    }],
  }, client).then((res) => res.map((r) => r.id));
  const attributeValues = await q.attributeValue.create.run({
    values: attributes.map((id) => {
      return {
        value: { uk: "value" + id },
        attributeId: id,
      };
    }),
  }, client).then((res) => res.map((r) => r.id));

  return { catId, attributes, attributeValues };
}

describe("Products", () => {
  describe("createProduct", () => {
    it("should create product with attributes", async () => {
      await using p = await createProducts();
      const fix = await fixture(p.db.client);
      const product = await p.products.createProduct({
        attributes: fix.attributeValues,
        categoryId: fix.catId,
        price: 100,
        name: { uk: "test", en: "test", ru: "test" },
      });

      expect(product).toMatchSnapshot({
        id: expect.any(Number),
      });
    });
  });
});
