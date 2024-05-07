// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").ILanguageCreateQueryQuery
 * >}
 */
export const languageCreateQuery = sql`
  INSERT INTO languages
    (name)
  VALUES
    ($name!)
  RETURNING
    id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").ILanguageUpdateQueryQuery
 * >}
 */
export const languageUpdateQuery = sql`
  UPDATE languages
  SET
    name = COALESCE($name, name)
  WHERE
    id = $id!
  RETURNING
    *;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").ILanguageDeleteQueryQuery
 * >}
 */
export const languageDeleteQuery = sql`
  DELETE FROM languages
  WHERE
    id = $id!
  RETURNING
    *;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").ILanguageGetQueryQuery
 * >}
 */
export const languageGetQuery = sql`
  SELECT
    *
  FROM
    languages
  WHERE
    id = $id!;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").ILanguageListQueryQuery
 * >}
 */
export const languageListQuery = sql`
  SELECT
    *
  FROM
    languages;
`;

export class Languages {
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
    const lang = await languageCreateQuery.run(
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
    const lang = await languageUpdateQuery.run(
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
    return await languageDeleteQuery.run(
      {
        id: id,
      },
      this.pool,
    );
  }

  async list() {
    return await languageListQuery.run(undefined, this.pool);
  }

  /** @param {number} id */
  async get(id) {
    return await languageGetQuery
      .run(
        {
          id: id,
        },
        this.pool,
      )
      .then((r) => r[0]);
  }
}
