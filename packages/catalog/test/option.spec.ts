import { describe, it, expect } from "vitest";
import { testDB } from "./utils";
import { Options } from "../src";
import { Pool } from "pg";

async function usingOptions() {
  const db = await testDB();
  const options = new Options({ pool: db.pool });

  return {
    db,
    options,
    [Symbol.asyncDispose]: db[Symbol.asyncDispose],
  };
}
describe("Options", () => {
  async function fixture(pool: Pool) {
    const sizeGroup: number = await pool
      .query(
        `
         INSERT INTO option_groups
         (type, sort_order)
         VALUES
         ('size', 1)
         RETURNING id
     `,
      )
      .then((res) => res.rows[0].id);
    const uk: number = await pool
      .query(`INSERT INTO languages (name) VALUES ('uk') RETURNING id`)
      .then((res) => res.rows[0].id);
    const en: number = await pool
      .query(`INSERT INTO languages (name) VALUES ('en') RETURNING id`)
      .then((res) => res.rows[0].id);

    return { sizeGroup, uk, en };
  }
  it("should create option", async () => {
    await using o = await usingOptions();
    const fix = await fixture(o.db.pool);
    const option = await o.options.createOption({
      value: "42",
      groupId: fix.sizeGroup,
      descriptions: [
        {
          name: "42",
          languageId: fix.uk,
        },
        {
          name: "42",
          languageId: fix.en,
        },
      ],
    });

    expect(option).toHaveProperty("id");
  });
});
