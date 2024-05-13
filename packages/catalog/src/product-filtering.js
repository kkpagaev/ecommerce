// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";
import { groupBy } from "lodash";

/**
 * @type {TaggedQuery<
 *   import("./queries/product-filtering.types").IGetOptionsQueryQuery
 * >}
 */
export const getOptionsQuery = sql`
  SELECT
    o.id,
    o.option_group_id,
    od.name,
    ogd.name AS option_group_name
  FROM options o
  JOIN product_variant_options pov ON pov.option_id = o.id
  JOIN product_variants pv ON pv.id = pov.product_variant_id
  JOIN option_descriptions od ON od.option_id = o.id
  JOIN products p ON p.id = pv.product_id
  JOIN option_group_descriptions ogd ON ogd.option_group_id = o.option_group_id
  WHERE p.category_id = COALESCE($categoryId, p.category_id)
  AND od.language_id = COALESCE($languageId, od.language_id)
  AND ogd.language_id = COALESCE($languageId, ogd.language_id)
  GROUP BY o.id, od.name, ogd.name
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-filtering.types").IGetAttributesQuery
 * >}
 */
export const getAttributes = sql`
  SELECT
    a.id,
    a.attribute_group_id,
    ad.name as name,
    agd.name as group_name
  FROM attributes a
  JOIN attribute_descriptions ad ON ad.attribute_id = a.id
  JOIN attribute_group_descriptions agd ON agd.attribute_group_id = a.attribute_group_id
  JOIN product_attributes pa ON pa.attribute_id = a.id
  JOIN products p ON p.id = pa.product_id
  WHERE p.category_id = COALESCE($categoryId, p.category_id)
  AND ad.language_id = COALESCE($languageId, ad.language_id)
  AND agd.language_id = COALESCE($languageId, agd.language_id)
  GROUP BY a.id, ad.name, agd.name
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
   * }} input
   */
  async getFilters(input) {
    const options = await getOptionsQuery.run(
      {
        categoryId: input.category?.id,
        languageId: input.languageId,
      },
      this.pool,
    );
    const attributes = await getAttributes.run(
      {
        categoryId: input.category?.id,
        languageId: input.languageId,
      },
      this.pool,
    );

    return {
      options: groupBy(options, (o) => o.option_group_name),
      attributes: groupBy(attributes, (a) => a.group_name),
    };
  }
}
