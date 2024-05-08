// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";

/**
 * @type {TaggedQuery<
 *   import("./queries/option.types").IOptionFindManyQueryQuery
 * >}
 */
export const optionFindManyQuery = sql`
  SELECT
    o.*, g.type, od.name
  FROM
    options o
    JOIN option_groups g
      ON o.option_group_id = g.id
    JOIN option_descriptions od
      ON o.id = od.option_id
  WHERE
    od.language_id = $languageId!
  AND
    o.option_group_id = COALESCE($groupId, o.option_group_id)
  ORDER BY
    o.id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option.types").IOptionCountQueryQuery
 * >}
 */
export const optionCountQuery = sql`
  SELECT
    COUNT(*)
  FROM
    options
  WHERE
    option_group_id = COALESCE($groupId, option_group_id)
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option.types").IOptionCreateQueryQuery
 * >}
 */
export const optionCreateQuery = sql`
  INSERT INTO options
    (value, option_group_id)
  VALUES
    ($value!, $groupId!)
  RETURNING id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option.types").IOptionFindOneQueryQuery
 * >}
 */
export const optionFindOneQuery = sql`
  SELECT
    o.*, g.type
  FROM
    options o
    JOIN option_groups g
      ON o.option_group_id = g.id
  WHERE
    o.id = $id!
  LIMIT 1;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option.types").IOptionDescriptionUpsertQueryQuery
 * >}
 */
export const optionDescriptionUpsertQuery = sql`
  INSERT INTO option_descriptions
    (option_id, language_id, name)
  VALUES
    $$values(optionId!, languageId!, name!)
  ON CONFLICT
    (option_id, language_id)
  DO UPDATE
    SET name = EXCLUDED.name
  RETURNING option_id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option.types").IOptionUpdateQueryQuery
 * >}
 */
export const optionUpdateQuery = sql`
  UPDATE options
  SET
    value = COALESCE($value, value)
  WHERE
    id = $id!
  RETURNING id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option.types").IOptionDeleteQueryQuery
 * >}
 */
export const optionDeleteQuery = sql`
  DELETE FROM options
  WHERE id = $id!
`;

export class Options {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef UpsertOptionDescriptionProps
   * @property {string} name
   * @property {number} languageId
   */
  /**
   * @typedef CreateOptionProps
   * @property {string} value
   * @property {number} groupId
   * @property {UpsertOptionDescriptionProps[]} descriptions
   */
  /**
   * @param {CreateOptionProps} input
   * @throws Error
   */
  async createOption(input) {
    return tx(this.pool, async (client) => {
      const option = await optionCreateQuery
        .run(
          {
            groupId: input.groupId,
            value: input.value,
          },
          client,
        )
        .then((r) => r[0]);
      if (!option) {
        throw new Error("Failed to create option");
      }
      const descriptions = await optionDescriptionUpsertQuery.run(
        {
          values: input.descriptions.map((d) => ({
            name: d.name,
            languageId: d.languageId,
            optionId: option.id,
          })),
        },
        client,
      );

      return {
        ...option,
        descriptions,
      };
    });
  }

  /** @typedef {Partial<CreateOptionProps>} UpdateOptionProps */
  /**
   * @param {number} id
   * @param {UpdateOptionProps} input
   */
  async updateOption(id, input) {
    return tx(this.pool, async (client) => {
      const option = await optionUpdateQuery
        .run(
          {
            id: id,
            value: input.value,
          },
          client,
        )
        .then((r) => r[0]);
      if (input.descriptions) {
        await optionDescriptionUpsertQuery.run(
          {
            values: input.descriptions.map((d) => ({
              name: d.name,
              languageId: d.languageId,
              optionId: id,
            })),
          },
          client,
        );
      }

      return option;
    });
  }

  /**
   * @param {number} id
   * @throws Error
   */
  async deleteOption(id) {
    return await optionDeleteQuery.run(
      {
        id: id,
      },
      this.pool,
    );
  }

  /**
   * @typedef FindOneOptionProps
   * @property {number} id
   */
  /** @param {FindOneOptionProps} input */
  async findOneOption(input) {
    return await optionFindOneQuery.run(
      {
        id: input.id,
      },
      this.pool,
    );
  }

  /**
   * @typedef {{
   *   groupId?: number;
   *   languageId: number;
   * }} ListOptionsProps
   */
  /** @param {ListOptionsProps} input */
  async listOptions(input) {
    const options = await optionFindManyQuery.run(
      {
        languageId: input.languageId,
        groupId: input.groupId,
      },
      this.pool,
    );

    return options;
  }
}
