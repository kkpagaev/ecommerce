import { describe, expect, it } from "vitest";
import { Categories } from "../src/category";
import { testDB } from "./utils";
import { Pool } from "pg";

async function categories() {
  const db = await testDB();
  const category = Categories({ pool: db.pool });

  return {
    db,
    category,
    [Symbol.asyncDispose]: db[Symbol.asyncDispose],
  };
}

async function fixture(pool: Pool) {
  const uk: number = await pool.query(`INSERT INTO languages (name) VALUES ('uk') RETURNING id`).then((res) => res.rows[0].id);
  const en: number = await pool.query(`INSERT INTO languages (name) VALUES ('en') RETURNING id`).then((res) => res.rows[0].id);

  return {
    languages: { uk, en },
  };
}

describe("category", () => {
  it("create category", async () => {
    await using s = await categories();
    const f = await fixture(s.db.pool);
    const category = await s.category.createCategory({
      descriptions: [{
        name: "тест",
        languageId: f.languages.uk,
      }],
    });

    expect(category).toHaveProperty("id");

    const id = category!.id;
    const category2 = await s.category.findCategoryById(id);

    expect(category2).toEqual({
      id,
      slug: "test",
      descriptions: [{
        categoryId: id,
        languageId: f.languages.uk,
        name: "тест",
      }],
    });
  });

  it("should update category", async () => {
    await using s = await categories();
    const fix = await fixture(s.db.pool);
    const category = await s.category.createCategory({
      descriptions: [{
        languageId: fix.languages.uk,
        name: "foo",
      }],
    });
    const id = category!.id;
    await s.category.updateCategory(id, {
      descriptions: [{
        languageId: fix.languages.uk,
        name: "bar",
      }],
    });

    const updated = await s.category.findCategoryById(id);

    expect(updated?.descriptions[0]?.name).toEqual("bar");
  });
});
