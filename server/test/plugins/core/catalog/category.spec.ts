import { describe, expect, it } from "vitest";
import { testDB } from "../../../utils";
import { createCategory, findCategoryById } from "../../../../src/core/catalog/category";

describe("category", () => {
  it("create category", async () => {
    await using db = await testDB();
    const category = await createCategory(db.pool, {
      name: "test",
      description: "test",
    });

    expect(category).toHaveProperty("id");

    const id = category.id;
    const category2 = await findCategoryById(db.pool, id);

    expect(category2).toEqual({
      id,
      name: "test",
      slug: "test",
      description: "test",
    });
  });

  it("create category with cyrillic name", async () => {
    await using db = await testDB();
    const category = await createCategory(db.pool, {
      name: "тест",
      description: "тест",
    });

    expect(category).toHaveProperty("id");

    const id = category.id;
    const category2 = await findCategoryById(db.pool, id);

    expect(category2).toEqual({
      id,
      name: "тест",
      slug: "test",
      description: "тест",
    });
  });
});
