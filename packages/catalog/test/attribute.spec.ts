import { describe, expect, it } from "vitest";
import { Pool, PoolClient } from "pg";
import { Attributes } from "../src/attribute";
import { testDB } from "@repo/test-utils";

async function createAttributes() {
  const db = await testDB(process.env.DATABASE_URL || "postgresql://user:user@localhost:1252/user");
  const attributes = Attributes({ pool: db.pool });

  return {
    attributes,
    db,
    [Symbol.asyncDispose]: db[Symbol.asyncDispose],
  };
}

// async function allAttributes(pool: Pool, attrId: number) {
//   return pool.query(`SELECT * FROM attribute_value WHERE attribute_id = ${attrId}`).then((res) => res.rows);
// }
describe("Attributes", () => {
  async function fixture(pool: PoolClient) {
    const group: number = await pool.query("INSERT INTO attribute_groups (sort_order) VALUES (1) RETURNING id").then((res) => res.rows[0].id);
    const uk: number = await pool.query(`INSERT INTO languages (name) VALUES ('uk') RETURNING id`).then((res) => res.rows[0].id);
    const en: number = await pool.query(`INSERT INTO languages (name) VALUES ('en') RETURNING id`).then((res) => res.rows[0].id);
    return {
      group,
      languages: {
        uk, en,
      },
    };
  }

  it("should create attribute", async () => {
    await using a = await createAttributes();
    const fix = await fixture(a.db.client);

    const res = await a.attributes.createAttribute({
      groupId: fix.group,
      descriptions: [{
        name: "testuk",
        languageId: fix.languages.uk,
      }],
    });

    expect(res).toEqual({
      id: expect.any(Number),
      descriptions: expect.any(Array),
    });
  });
});

// describe("AttributeGroups", () => {
//   async function fixture(pool: Pool) {
//     const attributes = await q.attribute.create.run({
//       values: [{
//         name: { uk: "test", en: "test", ru: "test" },
//         description: { uk: "test", en: "test", ru: "test" },
//       },
//       {
//         name: { uk: "test2", en: "test2", ru: "test2" },
//         description: { uk: "test2", en: "test2", ru: "test2" },
//       }],
//     }, pool).then((res) => res.map((r) => r.id));
//     const attributeValues = await q.attributeValue.create.run({
//       values: attributes.map((id) => {
//         return {
//           value: { uk: "value" + id, en: "value" + id, ru: "value" + id },
//           attributeId: id,
//         };
//       }),
//     }, pool).then((res) => res.map((r) => r.id));
//
//     return { attributes, attributeValues };
//   }
//
//   describe("upsertAttributeValue", () => {
//     it("delete old values and insert new", async () => {
//       await using a = await createAttributes();
//       const fix = await fixture(a.db.pool);
//
//       await a.attributes.upsertAttributeValue(fix!.attributes[0]!, [{
//         value: { uk: "new", en: "new", ru: "new" },
//         attributeId: fix.attributes[0]!,
//       }, {
//         value: { uk: "new2", en: "new2", ru: "new2" },
//         attributeId: fix.attributes[0]!,
//       }]);
//       {
//         const res = await allAttributes(a.db.pool, fix.attributes[0]!);
//
//         expect(res).toHaveLength(2);
//         expect(res.map((r) => r.id)).not.include(fix.attributeValues[0]);
//         expect(res[0]!.value).toEqual({ uk: "new", en: "new", ru: "new" });
//         expect(res[1]!.value).toEqual({ uk: "new2", en: "new2", ru: "new2" });
//       }
//     });
//
//     it("should update old value", async () => {
//       await using a = await createAttributes();
//       const fix = await fixture(a.db.pool);
//
//       await a.attributes.upsertAttributeValue(fix.attributes[0]!, [{
//         id: fix.attributeValues[0],
//         value: { uk: "new", en: "new", ru: "new" },
//         attributeId: fix.attributes[0]!,
//       }]);
//
//       {
//         const res = await allAttributes(a.db.pool, fix.attributes[0]!);
//
//         expect(res).toHaveLength(1);
//         expect(res[0]!.id).toEqual(fix.attributeValues[0]!);
//         expect(res[0]!.value).toEqual({ uk: "new", en: "new", ru: "new" });
//       }
//     });
//   });
// });
