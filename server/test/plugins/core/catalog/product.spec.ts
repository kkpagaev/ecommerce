import { describe, expect, it } from "vitest";
import { testDB } from "../../../utils";
import { Products } from "../../../../src/core/catalog/product";
import { catalogQueries as q } from "../../../../src/core/catalog/queries";
import { Pool } from "pg";

async function createProducts() {
  const db = await testDB();
  const products = Products({ pool: db.pool });

  return {
    products,
    db,
    [Symbol.asyncDispose]: db[Symbol.asyncDispose],
  };
}

async function fixture(pool: Pool) {
  const catId = await q.category.create.run({
    name: { uk: "test" },
    slug: "test",
  }, pool).then((res) => res[0].id);
  const attributes = await q.attribute.create.run({
    values: [{
      name: { uk: "test" },
      description: { uk: "test" },
    },
    {
      name: { uk: "test2" },
      description: { uk: "test2" },
    }],
  }, pool).then((res) => res.map((r) => r.id));
  const attributeValues = await q.attributeValue.create.run({
    values: attributes.map((id) => {
      return {
        value: { uk: "value" + id },
        attributeId: id,
      };
    }),
  }, pool).then((res) => res.map((r) => r.id));
  const product = await q.product.create.run({
    name: { uk: "test", en: "test", ru: "test" },
    description: { uk: "test", en: "test", ru: "test" },
    categoryId: catId,
    slug: "test",
  }, pool).then((res) => res[0]);
  await q.productAttributeValue.create.run({
    values: attributeValues.map((id) => ({
      productId: product.id,
      attributeValueId: id,
    })),
  }, pool);

  return { catId, attributes, attributeValues, product };
}

describe("Products", () => {
  describe("findOneProduct", () => {
    it("should find product by id", async () => {
      await using p = await createProducts();
      const fix = await fixture(p.db.pool);
      const product = await p.products.findOneProduct({
        id: fix.product.id,
      });

      expect(product).toEqual({
        id: fix.product.id,
        name: { uk: "test", en: "test", ru: "test" },
        description: { uk: "test", en: "test", ru: "test" },
        attributes: expect.any(Array),
        category_id: expect.any(Number),
        slug: "test",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });

      expect(product.attributes).toHaveLength(fix.attributeValues.length);
      expect(product.attributes[0]).toEqual({
        attribute_id: expect.any(Number),
        attribute_name: expect.any(Object),
        id: expect.any(Number),
        value: expect.any(Object),
      });
    });
  });

  describe("createProduct", () => {
    it("should create product with attributes", async () => {
      await using p = await createProducts();
      const fix = await fixture(p.db.pool);
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

  describe("updateProduct", () => {
    it("should update update attributes", async () => {
      await using p = await createProducts();
      const fix = await fixture(p.db.pool);

      async function getProduct() {
        const product = await p.products.findOneProduct({
          id: fix.product.id,
        });
        return product;
      }

      // decrease attribute count
      await expect(p.products.updateProduct(fix.product.id, {
        attributes: [fix.attributeValues[0]],
      })).resolves.not.toThrow();

      expect(await getProduct().then((r) => r.attributes)).toHaveLength(1);

      // get back the same
      await expect(p.products.updateProduct(fix.product.id, {
        attributes: fix.attributeValues,
      })).resolves.not.toThrow();

      expect(await getProduct().then((r) => r.attributes)).toHaveLength(2);

      // set attributes to 0
      await expect(p.products.updateProduct(fix.product.id, {
        attributes: [],
      })).resolves.not.toThrow();

      expect(await getProduct().then((r) => r.attributes)).toHaveLength(0);
    });
  });

  describe("deleteProduct", () => {
    it("should delete product", async () => {
      await using p = await createProducts();
      const fix = await fixture(p.db.pool);

      await expect(p.products.deleteProduct({
        id: fix.product.id,
      })).resolves.toBe(fix.product.id);
    });

    it("should not delete product", async () => {
      await using p = await createProducts();

      await expect(p.products.deleteProduct({
        id: 1000000000,
      })).resolves.toBeUndefined();
    });
  });
});
