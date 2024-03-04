import { Stocks } from "../src/stocks";
import { Pool } from "pg";
import { describe, it, expect } from "vitest";

async function usingStocks() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://user:user@localhost:1252/user",
  });
  const client = await pool.connect();

  await pool.query(`CREATE TEMPORARY TABLE products (id serial primary key)`);
  await pool.query(`CREATE TEMPORARY TABLE attribute_values (id serial primary key)`);
  await pool.query(`CREATE TEMPORARY TABLE inventory_locations (LIKE inventory_locations INCLUDING ALL)`);
  await pool.query(`CREATE TEMPORARY TABLE stocks (LIKE stocks INCLUDING ALL)`);

  const stocks = Stocks({ pool: pool });

  return {
    pool,
    stocks,
    async [Symbol.asyncDispose]() {
      client.release();
      await pool.end();
    },
  };
}

async function fixture(pool: Pool) {
  const products: { id: number }[] = await pool.query(`
    INSERT INTO products (id) VALUES (1), (2) RETURNING id
 `).then((res) => res.rows);

  const attributeValue: { id: number } = await pool.query(`
    INSERT INTO attribute_values (id) VALUES (1) RETURNING id
 `).then((res) => res.rows[0]);
  const location: { id: number; name: string } = await pool.query(`
    INSERT INTO inventory_locations (id, name) VALUES (1, 'test') RETURNING id, name
  `).then((res) => res.rows[0]);

  return {
    products,
    attributeValue,
    location,
  };
}

describe("Stocks", () => {
  it("should insert new stock", async () => {
    await using s = await usingStocks();
    const fix = await fixture(s.pool);
    const product = fix.products[0]!;
    const res = await s.stocks.upsertStocks([
      {
        count: 1,
        productId: product.id,
        locationId: fix.location.id,
        attributeValueId: fix.attributeValue.id,
      },
    ]);

    expect(res[0]).toBeDefined();
  });

  it("should update stock", async () => {
    await using s = await usingStocks();
    const fix = await fixture(s.pool);
    const product = fix.products[0]!;
    const inserted = await s.stocks.upsertStocks([
      {
        count: 1,
        productId: product.id,
        locationId: fix.location.id,
        attributeValueId: fix.attributeValue.id,
      },
    ]);
    expect(inserted[0]).toBeDefined();
    expect(inserted[0]?.count).toBe(1);

    const updated = await s.stocks.upsertStocks([
      {
        count: 2,
        productId: product.id,
        locationId: fix.location.id,
        attributeValueId: fix.attributeValue.id,
      },
    ]);

    expect(updated[0]?.count).toBe(2);
  });

  it("should create multiple stocks", async () => {
    await using s = await usingStocks();
    const fix = await fixture(s.pool);
    const [product1, product2] = fix.products;

    const inserted = await s.stocks.upsertStocks([
      {
        count: 1,
        productId: product1!.id,
        locationId: fix.location.id,
        attributeValueId: fix.attributeValue.id,
      },
      {
        count: 2,
        productId: product2!.id,
        locationId: fix.location.id,
        attributeValueId: fix.attributeValue.id,
      },
    ]);

    expect(inserted[0]).toBeDefined();
    expect(inserted[1]).toBeDefined();
    expect(inserted.length).toEqual(2);
  });
});
