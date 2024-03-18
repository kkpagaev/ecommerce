import { describe, it, expect } from "vitest";

import { Pool } from "pg";
import { Orders } from "../src/orders";

async function usingOrders() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL || "postgresql://user:user@localhost:1252/user",
  });
  const client = await pool.connect();

  await pool.query(`CREATE TEMPORARY TABLE orders (LIKE orders INCLUDING ALL)`);
  await pool.query(
    `CREATE TEMPORARY TABLE order_history (LIKE order_history INCLUDING ALL)`,
  );
  await pool.query(
    `CREATE TEMPORARY TABLE order_items (LIKE order_items INCLUDING ALL)`,
  );

  const orders = new Orders({ pool: pool });

  return {
    pool,
    orders,
    async [Symbol.asyncDispose]() {
      client.release();
      await pool.end();
    },
  };
}
describe("Orders", () => {
  it("should create an order", async () => {
    await using o = await usingOrders();

    const order = await o.orders.createOrder({
      products: [
        {
          price: 100,
          optionId: 1,
          quantity: 2,
          productId: 1,
        },
      ],
    });

    expect(order.price).toEqual(200);
  });
});
