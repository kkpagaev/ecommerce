// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";

// export const getOptionsQuery = sql`
// SELECT
//     ogd.name AS group_name,
//     og.id AS group_id,
//     od.name AS option_name,
//     o.id AS option_id
//   FROM categories c
//   JOIN products p on p.category_id = c.id
//   JOIN options o on o.id = po.option_id
//   JOIN option_groups og ON og.id = o.option_group_id
//   JOIN option_descriptions od ON od.option_id = o.id
//   JOIN option_group_descriptions ogd ON ogd.option_group_id = og.id
//   WHERE
//     p.category_id = COALESCE($categoryId, p.category_id)
//   GROUP BY ogd.name, og.id, od.name, o.id;
// `;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-filtering.types").IGetAttributesQuery
 * >}
 */
export const getAttributes = sql`
  SELECT
    agd.name AS group_name,
    ag.id AS group_id,
    ad.name AS attribute_name,
    a.id AS attribute_id
  FROM categories c
  JOIN products p on p.category_id = c.id
  JOIN product_attributes pa on pa.product_id = p.id
  JOIN attributes a on a.id = pa.attribute_id
  JOIN attribute_groups ag ON ag.id = a.attribute_group_id
  JOIN attribute_descriptions ad ON ad.attribute_id = a.id
  JOIN attribute_group_descriptions agd ON agd.attribute_group_id = ag.id
  WHERE
    p.category_id = COALESCE($categoryId, p.category_id)
  GROUP BY agd.name, ag.id, ad.name, a.id;
`;

export class ProductFiltering {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @param {{
   *   category?: {
   *     slug?: string;
   *     id?: number;
   *   };
   *   languageId?: number;
   *   attributes: number[];
   *   options: number[];
   * }} input
   */
  async getFilters(input) {
    // const options = await getOptionsQuery.run(
    //   {
    //     categoryId: input.category?.id,
    //   },
    //   this.pool,
    // );
    // const attributes = await getAttributes.run(
    //   {
    //     categoryId: input.category?.id,
    //   },
    //   this.pool,
    // );

    return {
      options: [],
      attributes: [],
    };
  }
}
