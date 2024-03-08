// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
import slugify from "slugify";
import { tx } from "@repo/pool";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryUpdateQueryQuery
 * >} *
 */
export const categoryUpdateQuery = sql`
  UPDATE categories
  SET
    slug = COALESCE($slug, slug)
  WHERE
    id = $id!
  RETURNING id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryListQueryQuery
 * >}
 */
export const categoryListQuery = sql`
  SELECT id, slug, cd.*
  FROM categories c
  JOIN category_descriptions cd ON c.id = cd.category_id
  WHERE cd.language_id = $language_id!
  ORDER BY id
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryListCountQueryQuery
 * >}
 */
export const categoryListCountQuery = sql`
  SELECT COUNT(*) FROM categories;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryFindOneQueryQuery
 * >}
 */
export const categoryFindOneQuery = sql`
  SELECT id, slug FROM categories
  WHERE id = COALESCE($id, id)
  AND slug = COALESCE($slug, slug);
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryDescriptionListQueryQuery
 * >}
 */
export const categoryDescriptionListQuery = sql`
  SELECT category_id, language_id, name FROM category_descriptions
  WHERE category_id = $category_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryCreateQueryQuery
 * >}
 */
export const categoryCreateQuery = sql`
  INSERT INTO categories
    (slug)
  VALUES
    ($slug!)
  RETURNING id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryDescriptionUpsertQueryQuery
 * >}
 */
export const categoryDescriptionUpsertQuery = sql`
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

export class Categories {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef {{
   *   languageId: number;
   *   page: number;
   *   limit: number;
   * }} ListCategoriesProps
   */
  /** @param {ListCategoriesProps} input */
  async listCategories(input) {
    const res = await categoryListQuery.run(
      {
        language_id: input.languageId,
        page: input.page,
        limit: input.limit,
      },
      this.pool,
    );
    const count = await categoryListCountQuery
      .run(undefined, this.pool)
      .then((res) => +(res[0]?.count ?? 0));

    return {
      data: res,
      count: count,
    };
  }

  /** @param {number} id */
  async findCategoryById(id) {
    const res = await categoryFindOneQuery
      .run({ id }, this.pool)
      .then((res) => res[0]);
    if (!res) return null;
    const descriptions = await categoryDescriptionListQuery.run(
      {
        category_id: id,
      },
      this.pool,
    );

    return {
      ...res,
      descriptions,
    };
  }

  /**
   * @typedef {{
   *   descriptions: {
   *     name: string;
   *     languageId: number;
   *   }[];
   * }} CreateCategoryProps
   */
  /** @param {CreateCategoryProps} input */
  async createCategory(input) {
    const name = input.descriptions && input.descriptions[0]?.name;
    const slug = name ? slugify(name) : "";

    return tx(this.pool, async (client) => {
      const res = await categoryCreateQuery
        .run(
          {
            slug: slug,
          },
          client,
        )
        .then((res) => res[0]);
      if (!res) throw new Error("Failed to create category");
      const descriptions = await categoryDescriptionUpsertQuery.run(
        {
          values: input.descriptions.map((d) => ({
            name: d.name,
            language_id: d.languageId,
            category_id: res.id,
          })),
        },
        client,
      );

      return {
        ...res,
        descriptions,
      };
    });
  }

  /**
   * @typedef {{
   *   descriptions?: {
   *     name: string;
   *     languageId: number;
   *   }[];
   * }} UpdateCategoryProps
   */
  /**
   * @param {number} id
   * @param {UpdateCategoryProps} input
   */
  async updateCategory(id, input) {
    const name = input.descriptions && input.descriptions[0]?.name;
    const slug = name ? slugify(name) : undefined;

    return tx(this.pool, async (client) => {
      const res = await categoryUpdateQuery.run(
        {
          slug,
          id,
        },
        this.pool,
      );

      if (input.descriptions) {
        await categoryDescriptionUpsertQuery.run(
          {
            values: input.descriptions.map((d) => ({
              name: d.name,
              language_id: d.languageId,
              category_id: id,
            })),
          },
          client,
        );
      }
      return res;
    });
  }
}