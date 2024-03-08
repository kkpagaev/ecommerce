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
    (product_id, attribute_id, location_id, count)
  VALUES
    $$values(product_id!, attribute_id!, location_id!, count!)
  ON CONFLICT
    (product_id, attribute_id, location_id)
  DO
    UPDATE
      SET count = EXCLUDED.count
  RETURNING
    *;
`;

export class Stocks {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef {{
   *   productId: number;
   *   attributeValueId: number;
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
          attribute_id: p.attributeValueId,
          location_id: p.locationId,
          count: p.count,
        })),
      },
      this.pool,
    );

    return result;
  }
}