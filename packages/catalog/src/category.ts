import { Pool } from "pg";
import slugify from "slugify";
import { ICategoryDescriptionListQueryQuery, ICategoryFindOneQueryQuery, ICategoryListCountQueryQuery, ICategoryListQueryQuery, ICategoryUpdateQueryQuery, ICategoryDescriptionUpsertQueryQuery, ICategoryCreateQueryQuery } from "./category.types";
import { sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";

export type Categories = ReturnType<typeof Categories>;

export function Categories(f: { pool: Pool }) {
  return {
    listCategories: listCategories.bind(null, f.pool),
    findCategoryById: findCategoryById.bind(null, f.pool),
    createCategory: createCategory.bind(null, f.pool),
    updateCategory: updateCategory.bind(null, f.pool),
  };
}

export const categoryListQuery = sql<ICategoryListQueryQuery>`
  SELECT id, slug, cd.*
  FROM categories c
  JOIN category_descriptions cd ON c.id = cd.category_id
  WHERE cd.language_id = $language_id!
  ORDER BY id
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;
export const categoryListCountQuery = sql<ICategoryListCountQueryQuery>`
  SELECT COUNT(*) FROM categories;
`;

type ListCategoriesProps = {
  languageId: number;
  page: number;
  limit: number;
};
export async function listCategories(pool: Pool, input: ListCategoriesProps) {
  const res = await categoryListQuery.run(
    {
      language_id: input.languageId,
      page: input.page,
      limit: input.limit,
    },
    pool
  );
  const count = await categoryListCountQuery
    .run(undefined, pool)
    .then((res) => +(res[0]?.count ?? 0));

  return {
    data: res,
    count: count,
  };
}

export const categoryFindOneQuery = sql<ICategoryFindOneQueryQuery>`
  SELECT id, slug FROM categories
  WHERE id = COALESCE($id, id)
  AND slug = COALESCE($slug, slug);
`;
export const categoryDescriptionListQuery = sql<ICategoryDescriptionListQueryQuery>`
  SELECT * FROM category_descriptions
  WHERE category_id = $category_id!
`;

export async function findCategoryById(pool: Pool, id: number) {
  const res = await categoryFindOneQuery.run({ id }, pool).then((res) => res[0]);
  if (!res) return null;
  const descriptions = await categoryDescriptionListQuery.run({
    category_id: id,
  }, pool);

  return {
    ...res,
    descriptions,
  };
}

export const categoryCreateQuery = sql<ICategoryCreateQueryQuery>`
  INSERT INTO categories
    (slug)
  VALUES
    ($slug!)
  RETURNING id;
`;
export const categoryDescriptionUpsertQuery = sql<ICategoryDescriptionUpsertQueryQuery>`
  INSERT INTO category_descriptions
    (category_id, language_id, name)
  VALUES
    $$values(category_id!, language_id!, name!)
  ON CONFLICT
    (category_id, language_id)
  DO
    UPDATE
    SET
      name = EXCLUDED.name
  RETURNING
    *;
`;
type CreateCategoryProps = {
  descriptions: Array<{
    name: string;
    languageId: number;
  }>;
};
export async function createCategory(pool: Pool, input: CreateCategoryProps) {
  const slug = slugify(input[0].name);

  return tx(pool, async (client) => {
    const res = await categoryCreateQuery.run({
      slug: slug,
    }, client).then((res) => res[0]);
    if (!res) throw new Error("Failed to create category");
    const descriptions = await categoryDescriptionUpsertQuery.run({
      values: input.descriptions.map((d) => ({
        name: d.name,
        language_id: d.languageId,
        category_id: res.id,
      })),
    }, client);
    return {
      ...res,
      descriptions,
    };
  });
}

export const categoryUpdateQuery = sql<ICategoryUpdateQueryQuery>`
  UPDATE categories
  SET
    slug = COALESCE($slug, slug)
  WHERE
    id = $id!
  RETURNING id;
`;
type UpdateCategoryProps = {
  descriptions?: Array<{
    name: string;
    languageId: number;
  }>;
};
export async function updateCategory(pool: Pool, id: number, input: UpdateCategoryProps) {
  const slug = input[0] ? slugify(input[0].name) : undefined;

  return tx(pool, async (client) => {
    const res = await categoryUpdateQuery.run({
      slug,
      id,
    }, pool);

    if (input.descriptions) {
      await categoryDescriptionUpsertQuery.run({
        values: input.descriptions.map((d) => ({
          name: d.name,
          language_id: d.languageId,
          category_id: id,
        })),
      }, client);
    }
    return res;
  });
}
