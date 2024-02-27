import { describe, expect, it } from "vitest";
import { Attributes } from "../../../../src/core/catalog/attribute";
import { testDB } from "../../../utils";
import { catalogQueries as q } from "../../../../src/core/catalog/queries";
import { Pool } from "pg";

async function createAttributes() {
  const db = await testDB();
  const attributes = Attributes({ pool: db.pool });

  return {
    attributes,
    db,
    [Symbol.asyncDispose]: db[Symbol.asyncDispose],
  };
}

describe("Attributes", () => {
  it("should create attribute", async () => {
    await using a = await createAttributes();
    const res = await a.attributes.createAttribute({
      name: { uk: "test", en: "test", ru: "test" },
    });

    expect(res).toEqual({
      id: expect.any(Number),
    });
  });
});

describe("AttributeValues", () => {
  async function fixture(pool: Pool) {
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

    return { attributes, attributeValues };
  }

  describe("upsertAttributeValue", () => {
    function allAttributes(pool: Pool, attrId: number) {
      return q.attributeValue.list.run({
        attribute_id: attrId,
      }, pool);
    }
    it("delete old values and insert new", async () => {
      await using a = await createAttributes();
      const fix = await fixture(a.db.pool);

      await a.attributes.upsertAttributeValue(fix.attributes[0], [{
        value: { uk: "new", en: "new", ru: "new" },
        attributeId: fix.attributes[0],
      }, {
        value: { uk: "new2", en: "new2", ru: "new2" },
        attributeId: fix.attributes[0],
      }]);
      {
        const res = await allAttributes(a.db.pool, fix.attributes[0]);

        expect(res).toHaveLength(2);
        expect(res.map((r) => r.id)).not.include(fix.attributeValues[0]);
        expect(res[0].value).toEqual({ uk: "new", en: "new", ru: "new" });
        expect(res[1].value).toEqual({ uk: "new2", en: "new2", ru: "new2" });
      }
    });

    it("should update old value", async () => {
      await using a = await createAttributes();
      const fix = await fixture(a.db.pool);

      await a.attributes.upsertAttributeValue(fix.attributes[0], [{
        id: fix.attributeValues[0],
        value: { uk: "new", en: "new", ru: "new" },
        attributeId: fix.attributes[0],
      }]);

      {
        const res = await allAttributes(a.db.pool, fix.attributes[0]);

        expect(res).toHaveLength(1);
        expect(res[0].id).toEqual(fix.attributeValues[0]);
        expect(res[0].value).toEqual({ uk: "new", en: "new", ru: "new" });
      }
    });
  });
});
