import { sql } from "@pgtyped/runtime";
import { IStockUpsertQueryQuery } from "./stocks.types";
import { Pool } from "pg";

export const stockUpsertQuery = sql<IStockUpsertQueryQuery>`
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
  pool: Pool;
  constructor(f: { pool: Pool }) {
    this.pool = f.pool;
  }

  async upsertStocks(
    params: Array<{
      productId: number;
      attributeValueId: number;
      locationId: number;
      count: number;
    }>,
  ) {
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
