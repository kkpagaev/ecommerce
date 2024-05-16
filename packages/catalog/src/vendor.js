// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";

/**
 * @type {TaggedQuery<
 *   import("./queries/vendor.types").IVendorCreateQueryQuery
 * >}
 */
export const vendorCreateQuery = sql`
  INSERT INTO vendors
    (name)
  VALUES
    ($name!)
  RETURNING
    id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/vendor.types").IVendorUpdateQueryQuery
 * >}
 */
export const vendorUpdateQuery = sql`
  UPDATE vendors
  SET
    name = COALESCE($name, name)
  WHERE
    id = $id!
  RETURNING
    *;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/vendor.types").IVendorDeleteQueryQuery
 * >}
 */
export const vendorDeleteQuery = sql`
  DELETE FROM vendors
  WHERE
    id = $id!
  RETURNING
    *;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/vendor.types").IVendorGetQueryQuery
 * >}
 */
export const vendorGetQuery = sql`
  SELECT
    *
  FROM
    vendors
  WHERE
    id = $id!;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/vendor.types").IVendorListQueryQuery
 * >}
 */
export const vendorListQuery = sql`
  SELECT
    *
  FROM
    vendors;
`;

export class Vendors {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @param {{
   *   name: string;
   * }} input
   */
  async create(input) {
    const lang = await vendorCreateQuery.run(
      {
        name: input.name,
      },
      this.pool,
    );

    return lang;
  }

  /**
   * @param {number} id
   * @param {{
   *   name?: string;
   * }} input
   */
  async update(id, input) {
    const lang = await vendorUpdateQuery.run(
      {
        id: id,
        name: input.name,
      },
      this.pool,
    );

    return lang;
  }

  /** @param {number} id */
  async delete(id) {
    return await vendorDeleteQuery.run(
      {
        id: id,
      },
      this.pool,
    );
  }

  async list() {
    return await vendorListQuery.run(undefined, this.pool);
  }

  /** @param {number} id */
  async get(id) {
    return await vendorGetQuery
      .run(
        {
          id: id,
        },
        this.pool,
      )
      .then((r) => r[0]);
  }
}
