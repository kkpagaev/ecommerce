// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";

/**
 * @type {TaggedQuery<
 *   import("./queries/location.types").ILocationListQueryQuery
 * >}
 */
export const locationListQuery = sql`
  SELECT
      id,
      name
  FROM
      locations
  WHERE
    name = COALESCE($name, name)
  ORDER BY
      id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/location.types").ILocationFindOneQueryQuery
 * >}
 */
export const locationFindOneQuery = sql`
  SELECT
      id,
      name
  FROM
      locations
  WHERE
    id = COALESCE($id, id)
    AND name = COALESCE($name, name)
  LIMIT 1;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/location.types").ILocationCreateQueryQuery
 * >}
 */
export const locationCreateQuery = sql`
  INSERT INTO locations (name) VALUES ($name!) RETURNING id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/location.types").ILocationUpdateQueryQuery
 * >}
 */
export const locationUpdateQuery = sql`
  UPDATE locations
  SET
      name = COALESCE($name, name)
  WHERE
      id = $id!;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/location.types").ILocationDeleteQueryQuery
 * >}
 */
export const locationDeleteQuery = sql`
  DELETE FROM locations
  WHERE id = $id!
`;

export class Locations {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef {{
   *   name: string;
   * }} CreateLocationParams
   */
  /** @param {CreateLocationParams} params */
  async createLocation(params) {
    const result = await locationCreateQuery
      .run(
        {
          name: params.name,
        },
        this.pool,
      )
      .then((r) => r[0]);

    return result;
  }
  /** @typedef {Partial<CreateLocationParams>} UpdateLocationParams */

  /**
   * @param {number} id
   * @param {UpdateLocationParams} params
   */
  async updateLocation(id, params) {
    const result = await locationUpdateQuery.run(
      {
        id: id,
        name: params.name,
      },
      this.pool,
    );

    return result;
  }

  /**
   * @param {{
   *   name?: string;
   * }} input
   */
  async listLocations(input) {
    const res = await locationListQuery.run(
      {
        name: input.name,
      },
      this.pool,
    );

    return res;
  }

  /** @param {number} id */
  async deleteLocation(id) {
    const result = await locationDeleteQuery.run(
      {
        id: id,
      },
      this.pool,
    );

    return result;
  }
  /**
   * @typedef {{
   *   id?: number;
   *   name?: string;
   * }} FindOneLocationParams
   */
  /** @param {FindOneLocationParams} params */
  async findOneLocation(params) {
    const res = await locationFindOneQuery
      .run(params, this.pool)
      .then((r) => r[0]);

    return res;
  }
}
