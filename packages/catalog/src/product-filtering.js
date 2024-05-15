// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
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

/**
 * @type {TaggedQuery<
 *   import("./queries/product-filtering.types").IProductVariantPaginateQueryQuery
 * >}
 */
export const productVariantPaginateQuery = sql`
  SELECT 
    pv.id, pv.stock_status, pvd.name, pv.price, pv.images, pv.old_price, pv.slug
  FROM product_variants pv
  JOIN product_variant_descriptions pvd ON pvd.product_variant_id = pv.id
  WHERE
    pvd.language_id = COALESCE($languageId, pvd.language_id)
  AND 
    pv.id IN (
      SELECT
        pv.id
      FROM product_variants pv
      JOIN products p ON p.id = pv.product_id
      LEFT JOIN product_variant_options pvo ON pvo.product_variant_id = pv.id
      LEFT JOIN product_attributes pa ON pa.product_id = p.id
      where
        CASE
          WHEN $attributes::integer[] is not null THEN pa.attribute_id = ANY($attributes::integer[])
          ELSE TRUE
        END
      AND 
        CASE
          WHEN $options::integer[] is not null THEN pvo.option_id = any($options::integer[])
          ELSE TRUE
        END
      AND 
        CASE
          WHEN $vendors::integer[] is not null THEN p.vendor_id = any($vendors::integer[])
          ELSE TRUE
      END
      AND 
        p.category_id = COALESCE($categoryId, p.category_id)
      group by pv.id, pa.attribute_id, pvo.option_id 
    )
  LIMIT COALESCE($limit, 10)
  OFFSET COALESCE($offset, 0)
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-filtering.types").IProductVariantPaginateCountQueryQuery
 * >}
 */
export const productVariantPaginateCountQuery = sql`
  SELECT count(*) 
  FROM (
    SELECT
      pv.id
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    LEFT JOIN product_variant_options pvo ON pvo.product_variant_id = pv.id
    LEFT JOIN product_attributes pa ON pa.product_id = p.id
    where
      CASE
        WHEN $attributes::integer[] is not null THEN pa.attribute_id = ANY($attributes::integer[])
        ELSE TRUE
      END
    AND 
      CASE
        WHEN $options::integer[] is not null THEN pvo.option_id = any($options::integer[])
        ELSE TRUE
      END
    AND 
      CASE
        WHEN $vendors::integer[] is not null THEN p.vendor_id = any($vendors::integer[])
        ELSE TRUE
      END
    AND 
      p.category_id = COALESCE($categoryId, p.category_id)
    group by pv.id, pa.attribute_id, pvo.option_id 
  )
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

  /**
   * @param {{
   *   limit?: number;
   *   offset?: number;
   *   categoryId?: number;
   *   languageId?: number;
   *   vendors: number[];
   *   options: number[];
   *   attributes: number[];
   * }} input
   * @returns
   */
  async paginateVariants(input) {
    const res = await productVariantPaginateQuery.run(
      {
        limit: input.limit,
        offset: input.offset,
        categoryId: input.categoryId,
        languageId: input.languageId,
        options: input.options.length > 0 ? input.options : null,
        vendors: input.vendors.length > 0 ? input.vendors : null,
        attributes: input.attributes.length > 0 ? input.attributes : null,
      },
      this.pool,
    );
    const count = await productVariantPaginateCountQuery
      .run(
        {
          categoryId: input.categoryId,
          options: input.options.length > 0 ? input.options : null,
          vendors: input.vendors.length > 0 ? input.vendors : null,
          attributes: input.attributes.length > 0 ? input.attributes : null,
        },
        this.pool,
      )
      .then((r) => r?.[0]?.count || 0);

    return {
      data: res.map((p) => {
        const images = /** @type {any} */ (p.images);

        return {
          ...p,
          images: images,
        };
      }),
      count,
    };
  }
}
