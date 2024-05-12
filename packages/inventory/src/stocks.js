// eslint-disable-next-line no-unused-vars
import { sql, TaggedQuery } from "@pgtyped/runtime";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";

/**
 * @type {TaggedQuery<
 *   import("./queries/stocks.types").IStockUpsertQueryQuery
 * >}
 */
export const stockUpsertQuery = sql`
  INSERT INTO stocks
    (product_variant_id, location_id, count)
  VALUES
    $$values(product_variant_id!, location_id!, count!)
  ON CONFLICT
    (product_variant_id, location_id)
  DO
    UPDATE
      SET count = EXCLUDED.count
  RETURNING
    *;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/stocks.types").IProductStocksListQueryQuery
 * >}
 */
export const productStocksListQuery = sql`
  SELECT 
    p.id,
    pd.name,
    p.images,
    COALESCE(SUM(s.count), 0) AS count
  FROM products p
  LEFT JOIN product_variants pv ON pv.product_id = p.id
  LEFT JOIN product_descriptions pd ON pd.product_id = p.id
  LEFT JOIN stocks s ON s.product_variant_id = pv.id
  WHERE pd.language_id = $language_id!
  AND pd.name LIKE COALESCE(CONCAT('%', $name::text, '%'), pd.name)
  group by p.id, pd.name
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/stocks.types").IStocksListQueryQuery
 * >}
 */
export const stocksListQuery = sql`
  SELECT
    product_variant_id,
    location_id,
    count
  FROM
    stocks
  WHERE
    product_variant_id = COALESCE($product_variant_id, product_variant_id)
  AND
    location_id = COALESCE($location_id, location_id)
  ORDER BY
    product_variant_id,
    location_id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/stocks.types").IStockTotalStockQueryQuery
 * >}
 */
export const stockTotalStockQuery = sql`
  SELECT
    product_variant_id,
    CAST(COALESCE(SUM(count), 0) AS INTEGER) as count
  FROM
    stocks
  WHERE
    product_variant_id IN $$values(product_variant_id!)
  GROUP BY
    product_variant_id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/stocks.types").IProductVariantListStocksQueryQuery
 * >}
 */
export const productVariantListStocksQuery = sql`
  SELECT pv.id AS product_variant_id, 
  l.id AS location_id ,
  (SELECT COALESCE(SUM(ss.count), 0) AS count FROM stocks ss 
    WHERE ss.product_variant_id = pv.id
    AND ss.location_id = l.id
  ) AS count
  FROM product_variants pv CROSS JOIN locations l
  WHERE pv.product_id = $product_id!
  GROUP BY pv.id, l.id, pv.product_id
`;

export class Stocks {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @param {{
   *   productId: number;
   * }} input
   */
  async productVariantListStocks(input) {
    const res = await productVariantListStocksQuery.run(
      {
        product_id: input.productId,
      },
      this.pool,
    );

    return res.map((r) => ({ ...r, count: r.count === null ? 0 : +r.count }));
  }

  /**
   * @typedef {{
   *   productVariantId: number;
   *   locationId: number;
   *   count: number;
   * }} StockUpsertParams
   */

  /** @param {StockUpsertParams[]} params */
  async upsertStocks(params) {
    const result = await stockUpsertQuery.run(
      {
        values: params.map((p) => ({
          product_variant_id: p.productVariantId,
          location_id: p.locationId,
          count: p.count,
        })),
      },
      this.pool,
    );

    return result;
  }

  /**
   * @param {{
   *   productVariantId?: number;
   *   productId?: number;
   *   locationId?: number;
   * }} params
   */
  async listStocks(params) {
    const res = await stocksListQuery.run(
      {
        product_variant_id: params.productVariantId,
        location_id: params.locationId,
      },
      this.pool,
    );

    return res;
  }

  /**
   * @param {{
   *   name?: string;
   *   languageId: number;
   * }} params
   */
  async productListStocks(params) {
    const res = await productStocksListQuery.run(
      {
        language_id: params.languageId,
      },
      this.pool,
    );

    return res;
  }

  /**
   * @param {number[]} productVariantIds
   * @returns {Promise<
   *   {
   *     product_variant_id: number;
   *     count: number;
   *   }[]
   * >}
   */
  async getProductVariantStocks(productVariantIds) {
    const stocks = await stockTotalStockQuery.run(
      {
        values: productVariantIds.map((p) => ({
          product_variant_id: p,
        })),
      },
      this.pool,
    );

    return productVariantIds.map((variant) => {
      const stock = stocks.find((ss) => ss.product_variant_id === variant);

      return {
        product_variant_id: variant,
        count: stock?.count ?? 0,
      };
    });
  }

  /**
   * @param {{
   *   productVariantId: number;
   *   count: number;
   * }[]} params
   * @returns {Promise<
   *   {
   *     productVariantId: number;
   *     available: boolean;
   *   }[]
   * >}
   */
  async available(params) {
    const currentStocks = await this.getProductVariantStocks(
      params.map((p) => p.productVariantId),
    );

    return currentStocks.map((p) => {
      const stock = params.find(
        (s) => s.productVariantId === p.product_variant_id,
      );
      if (!stock) {
        return {
          productVariantId: p.product_variant_id,
          available: false,
        };
      }

      return {
        productVariantId: p.product_variant_id,
        available: p.count <= stock.count,
      };
    });
  }
}
