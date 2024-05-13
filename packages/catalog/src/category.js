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
    slug = COALESCE($slug, slug),
    parent_id = COALESCE($parentId, parent_id),
    image = COALESCE($image, image)
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
  SELECT c.id, c.slug, c.parent_id, f.url as image_url, cd.*
  FROM categories c
  JOIN category_descriptions cd ON c.id = cd.category_id
  LEFT JOIN file_uploads f ON c.image = f.id
  WHERE cd.language_id = $language_id!
  AND cd.name LIKE COALESCE(CONCAT('%', $name::text, '%'), cd.name)
  ORDER BY id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryFindOneQueryQuery
 * >}
 */
export const categoryFindOneQuery = sql`
  SELECT c.id, c.slug, c.parent_id, f.url as image_url, f.id as image_id FROM categories c
  LEFT JOIN file_uploads f ON image = f.id
  WHERE c.id = COALESCE($id, c.id)
  AND c.slug = COALESCE($slug, c.slug)
  LIMIT 1;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryFindOneWithDescriptionQueryQuery
 * >}
 */
export const categoryFindOneWithDescriptionQuery = sql`
  SELECT c.id, c.slug, cd.name, f.url as image_url, f.id as image_id FROM categories c
  LEFT JOIN file_uploads f ON image = f.id
  JOIN category_descriptions cd ON c.id = cd.category_id
  WHERE cd.language_id = $language_id!
  AND c.id = COALESCE($id, c.id)
  AND c.slug = COALESCE($slug, c.slug)
  LIMIT 1;
`;
/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryDescriptionListQueryQuery
 * >}
 */
export const categoryDescriptionListQuery = sql`
  SELECT cd.category_id, cd.language_id, cd.name, l.name as language_name
  FROM category_descriptions cd
  JOIN languages l ON cd.language_id = l.id
  WHERE category_id = $category_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/category.types").ICategoryCreateQueryQuery
 * >}
 */
export const categoryCreateQuery = sql`
  INSERT INTO categories
    (slug, image, parent_id)
  VALUES
    ($slug!, $image, $parentId)
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
   *   name?: string | undefined;
   * }} ListCategoriesProps
   */
  /** @param {ListCategoriesProps} input */
  async listCategories(input) {
    const res = await categoryListQuery.run(
      {
        language_id: input.languageId,
        name: input.name,
      },
      this.pool,
    );

    return res;
  }

  /**
   * @param {{
   *   slug: string;
   *   languageId: number;
   * }} input
   */
  async findCategoryBySlug(input) {
    const res = await categoryFindOneWithDescriptionQuery
      .run(
        {
          slug: input.slug,
          language_id: input.languageId,
        },
        this.pool,
      )
      .then((res) => res[0]);

    if (!res) return null;

    return res;
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
   *   imageId?: string;
   *   parentId?: number;
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
            parentId: input.parentId,
            image: input.imageId,
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
   *   parentId?: number;
   *   imageId?: string;
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
    console.log(input);

    return tx(this.pool, async (client) => {
      const res = await categoryUpdateQuery.run(
        {
          slug,
          parentId: input.parentId,
          image: input.imageId,
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
