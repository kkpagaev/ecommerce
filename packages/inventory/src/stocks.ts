import { sql } from "@pgtyped/runtime";
import { IStockUpsertQueryQuery } from "./stocks.types";
import { Pool } from "pg";

export function Stocks(f: { pool: Pool }) {
  return {
    upsertStocks: upsertStocks.bind(null, f.pool),
  };
}

export const stockUpsertQuery = sql<IStockUpsertQueryQuery>`
  INSERT INTO stocks
    (product_id, attribute_value_id, location_id, count)
  VALUES
    $$values(product_id!, attribute_value_id!, location_id!, count!)
  ON CONFLICT
    (product_id, attribute_value_id, location_id)
  DO
    UPDATE
      SET count = EXCLUDED.count
  RETURNING
    *;
`;

type CreateStockParams = Array<{
  productId: number;
  attributeValueId: number;
  locationId: number;
  count: number;
}>;
export async function upsertStocks(pool: Pool, params: CreateStockParams) {
  const result = await stockUpsertQuery.run({
    values: params.map((p) => ({
      product_id: p.productId,
      attribute_value_id: p.attributeValueId,
      location_id: p.locationId,
      count: p.count,
    })),
  }, pool);

  return result;
}
