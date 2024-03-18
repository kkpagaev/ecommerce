import { Stocks } from "../src/stocks";
import { Pool } from "pg";
import { describe, it, expect } from "vitest";

async function usingStocks() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL || "postgresql://user:user@localhost:1252/user",
  });
  const client = await pool.connect();

  await pool.query(`CREATE TEMPORARY TABLE products (id serial primary key)`);
  await pool.query(`CREATE TEMPORARY TABLE options (id serial primary key)`);
  await pool.query(`CREATE TEMPORARY TABLE locations (id serial primary key)`);

  await pool.query(`CREATE TEMPORARY TABLE stocks (LIKE stocks INCLUDING ALL)`);

  const stocks = new Stocks({ pool: pool });

  return {
    pool,
    stocks,
    async [Symbol.asyncDispose]() {
      client.release();
      await pool.end();
    },
  };
}

describe("Stocks", () => {
  describe("editing", () => {
    async function fixture(pool: Pool) {
      const products: { id: number }[] = await pool
        .query(
          `
    INSERT INTO products (id) VALUES (1), (2) RETURNING id
 `,
        )
        .then((res) => res.rows);

      const option: { id: number } = await pool
        .query(
          `
    INSERT INTO options (id) VALUES (1) RETURNING id
 `,
        )
        .then((res) => res.rows[0]);
      const location: { id: number } = await pool
        .query(
          `
    INSERT INTO locations (id) VALUES (1) RETURNING id
  `,
        )
        .then((res) => res.rows[0]);

      return {
        products,
        option,
        location,
      };
    }

    it("should insert new stock", async () => {
      await using s = await usingStocks();
      const fix = await fixture(s.pool);
      const product = fix.products[0]!;
      const res = await s.stocks.upsertStocks([
        {
          count: 1,
          productId: product.id,
          locationId: fix.location.id,
          optionId: fix.option.id,
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
          optionId: fix.option.id,
        },
      ]);
      expect(inserted[0]).toBeDefined();
      expect(inserted[0]?.count).toBe(1);

      const updated = await s.stocks.upsertStocks([
        {
          count: 2,
          productId: product.id,
          locationId: fix.location.id,
          optionId: fix.option.id,
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
          optionId: fix.option.id,
        },
        {
          count: 2,
          productId: product2!.id,
          locationId: fix.location.id,
          optionId: fix.option.id,
        },
      ]);

      expect(inserted[0]).toBeDefined();
      expect(inserted[1]).toBeDefined();
      expect(inserted.length).toEqual(2);
    });
  });

  describe("query", () => {
    async function fixture(pool: Pool) {
      const stocks: {
        product_id: number;
        option_id: number;
        location_id: number;
        count: number;
      }[] = await pool
        .query(
          `
        INSERT INTO stocks 
          (product_id, option_id, location_id, count) 
        VALUES
          (1, 10, 1, 2),
          (1, 10, 2, 2),
          (2, 10, 1, 2),
          (3, 11, 1, 2)
        RETURNING *
          `,
        )
        .then((res) => res.rows);

      return {
        stocks,
      };
    }

    it("should pass stock availability in different locations", async () => {
      await using s = await usingStocks();
      await fixture(s.pool);
      const res = await s.stocks.available([
        {
          productId: 1,
          optionId: 10,
          count: 4,
        },
        {
          productId: 2,
          optionId: 10,
          count: 4,
        },
      ]);

      expect(res).toEqual([
        {
          productId: 1,
          optionId: 10,
          available: true,
        },
        {
          productId: 2,
          optionId: 10,
          available: false,
        },
      ]);
    });
  });
});
