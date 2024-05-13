// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";

/**
 * @type {TaggedQuery<
 *   import("./queries/product-filtering.types").IGetOptionsQueryQuery
 * >}
 */
export const getOptionsQuery = sql`
  SELECT
    ogd.name AS group_name,
    og.id AS group_id,
    od.name AS option_name,
    o.id AS option_id,
    COUNT(pv.id) AS product_count
  FROM options o 
    JOIN option_groups og ON o.option_group_id = og.id
    JOIN product_variant_options pvo on pvo.option_id = o.id
    JOIN product_variants pv on pv.id = pvo.product_variant_id
    JOIN option_descriptions od ON od.option_id = o.id 
    JOIN option_group_descriptions ogd ON ogd.option_group_id = og.id
    JOIN products p ON p.id = pv.product_id
    JOIN product_attributes pa ON pa.product_id = p.id
  WHERE
    p.category_id = COALESCE(null, p.category_id)
  AND
    CASE 
      WHEN $attributes::integer[] is not null THEN pa.attribute_id = ANY($attributes::integer[])
      ELSE TRUE
    END
  GROUP BY ogd.name, og.id, od.name, o.id;
`;

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
    a.id AS attribute_id,
    COUNT(pv.id) AS product_count
  FROM attributes a 
  JOIN attribute_groups ag ON a.attribute_group_id = ag.id
  JOIN product_attributes pa on pa.attribute_id = a.id
  JOIN products p on p.id = pa.product_id
  JOIN product_variants pv on pv.product_id = p.id
  JOIN attribute_descriptions ad ON ad.attribute_id = a.id 
  JOIN attribute_group_descriptions agd ON agd.attribute_group_id = ag.id
  JOIN product_variant_options pvo on pvo.product_variant_id = pv.id
  JOIN options o on o.id = pvo.option_id
  WHERE
    p.category_id = COALESCE(null, p.category_id)
  AND
    CASE 
      WHEN $options::integer[] is not null THEN o.id = ANY($options::integer[])
      ELSE TRUE
    END
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
    const options = await getOptionsQuery.run(
      {
        attributes: input.attributes.length > 0 ? input.attributes : undefined,
      },
      this.pool,
    );
    const attributes = await getAttributes.run(
      {
        options: input.options.length > 0 ? input.options : undefined,
      },
      this.pool,
    );

    return {
      options,
      attributes,
    };
  }
}
