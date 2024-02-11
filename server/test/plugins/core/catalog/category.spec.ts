import { describe, expect, it } from "vitest";
import { testDB } from "../../../utils";
import { Categories } from "../../../../src/core/catalog/category";

async function categories() {
  const db = await testDB();
  const category = Categories({ pool: db.pool });

  return {
    category,
    [Symbol.asyncDispose]: db[Symbol.asyncDispose],
  };
}

describe("category", () => {
  it("create category", async () => {
    await using service = await categories();
    const category = await service.category.createCategory({
      name: "test",
      description: "test",
    });

    expect(category).toHaveProperty("id");

    const id = category.id;
    const category2 = await service.category.findCategoryById(id);

    expect(category2).toEqual({
      id,
      name: "test",
      slug: "test",
      description: "test",
    });
  });

  it("create category with cyrillic name", async () => {
    await using service = await categories();
    const category = await service.category.createCategory({
      name: "тест",
      description: "тест",
    });

    expect(category).toHaveProperty("id");

    const id = category.id;
    const category2 = await service.category.findCategoryById(id);

    expect(category2).toEqual({
      id,
      name: "тест",
      slug: "test",
      description: "тест",
    });
  });
});
