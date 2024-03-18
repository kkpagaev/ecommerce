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
    (product_id, option_id, location_id, count)
  VALUES
    $$values(product_id!, option_id!, location_id!, count!)
  ON CONFLICT
    (product_id, option_id, location_id)
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
    product_id,
    option_id,
    location_id,
    count
  FROM
    stocks
  WHERE
    product_id = COALESCE($product_id, product_id)
  AND
    option_id = COALESCE($option_id, option_id)
  AND
    location_id = COALESCE($location_id, location_id)
  ORDER BY
    product_id,
    option_id,
    location_id
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;

export const stockTotalStockQuery = {
  /**
   * @param {{ productId: number; optionId: number }[]} params
   * @param {Pool} pool
   * @returns {Promise<
   *   { product_id: number; option_id: number; count: number }[]
   * >}
   */
  run: async (params, pool) => {
    const query = `
      SELECT
        product_id,
        option_id,
        SUM("count") AS count 
      FROM stocks
      WHERE
        (product_id, option_id) 
      IN (${params.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(",")})
      GROUP BY product_id, option_id;
    `;

    return await pool
      .query(query, params.map((p) => [p.productId, p.optionId]).flat())
      .then((r) => r.rows);
  },
};

export class Stocks {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef {{
   *   productId: number;
   *   optionId: number;
   *   locationId: number;
   *   count: number;
   * }} StockUpsertParams
   */

  /** @param {StockUpsertParams[]} params */
  async upsertStocks(params) {
    const result = await stockUpsertQuery.run(
      {
        values: params.map((p) => ({
          product_id: p.productId,
          option_id: p.optionId,
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
   *   limit?: number;
   *   page?: number;
   *   productId?: number;
   *   optionId?: number;
   *   locationId?: number;
   * }} params
   */
  async listStocks(params) {
    const res = await stocksListQuery.run(
      {
        page: params.page,
        limit: params.limit,
        product_id: params.productId,
        option_id: params.optionId,
        location_id: params.locationId,
      },
      this.pool,
    );

    return res;
  }

  /**
   * @param {{
   *   productId: number;
   *   optionId: number;
   * }[]} params
   * @returns {Promise<
   *   {
   *     product_id: number;
   *     option_id: number;
   *     count: number;
   *   }[]
   * >}
   */
  async getProductStocks(params) {
    const stocks = await stockTotalStockQuery.run(
      params.map((p) => ({ productId: p.productId, optionId: p.optionId })),
      this.pool,
    );

    return stocks;
  }

  /**
   * @param {{
   *   productId: number;
   *   optionId: number;
   *   count: number;
   * }[]} params
   * @returns {Promise<
   *   {
   *     productId: number;
   *     optionId: number;
   *     available: boolean;
   *   }[]
   * >}
   */
  async available(params) {
    const currentStocks = await this.getProductStocks(params);

    return params.map((p) => {
      const current = currentStocks.find(
        (c) => c.product_id === p.productId && c.option_id === p.optionId,
      );
      const available = current ? current?.count >= p.count ?? false : false;

      return {
        productId: p.productId,
        optionId: p.optionId,
        available: available,
      };
    });
  }
}
