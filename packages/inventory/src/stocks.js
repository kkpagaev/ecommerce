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

export class Stocks {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
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
