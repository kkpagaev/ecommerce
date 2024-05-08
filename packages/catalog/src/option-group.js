/** @typedef {import("pg").Pool} Pool * */
// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";

/**
 * @type {TaggedQuery<
 *   import("./queries/option-group.types").IOptionGroupCreateQueryQuery
 * >} *
 */
export const optionGroupCreateQuery = sql`
  INSERT INTO option_groups
    (type)
  VALUES
    ($type!)
  RETURNING id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option-group.types").IOptionGroupFindOneQueryQuery
 * >} *
 */
export const optionGroupFindOneQuery = sql`
  SELECT
    *
  FROM
    option_groups
  WHERE
    id = COALESCE($id, id)
  LIMIT 1;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option-group.types").IOptionGroupDescriptionListQueryQuery
 * >} *
 */
export const optionGroupDescriptionListQuery = sql`
  SELECT
    *
  FROM
    option_group_descriptions
  WHERE
    option_group_id = $option_group_id!
  ORDER BY
    language_id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option-group.types").IOptionGroupUpdateQueryQuery
 * >} *
 */
export const optionGroupUpdateQuery = sql`
  UPDATE option_groups
  SET
    type = COALESCE($type, type)
  WHERE
    id = $id!
  RETURNING id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option-group.types").IOptionGroupDescriptionUpsertQueryQuery
 * >} *
 */
export const optionGroupDescriptionUpsertQuery = sql`
  INSERT INTO option_group_descriptions
    (option_group_id, language_id, name, description)
  VALUES
    $$values(option_group_id!, language_id!, name!, description)
  ON CONFLICT
    (option_group_id, language_id)
  DO
    UPDATE
      SET
        name = EXCLUDED.name,
        description = EXCLUDED.description
  RETURNING *;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/option-group.types").IOptionGroupListQueryQuery
 * >}
 */
export const optionGroupListQuery = sql`
  SELECT g.*, od.name as name FROM option_groups g
  JOIN option_group_descriptions od
    ON g.id = od.option_group_id
  WHERE od.language_id = $language_id!
  AND od.name LIKE COALESCE(CONCAT('%', $name::text, '%'), od.name)
`;

export class OptionGroups {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef CreateOptionGroupProps
   * @property {import("./queries/option-group.types").option_type} type
   * @property {{
   *   name: string;
   *   languageId: number;
   *   description?: string;
   * }[]} descriptions
   */

  /**
   * @param {CreateOptionGroupProps} input
   * @throws Error
   */
  async createOptionGroup(input) {
    return tx(this.pool, async (client) => {
      const group = await optionGroupCreateQuery
        .run(
          {
            type: input.type,
          },
          client,
        )
        .then((res) => res[0]);
      if (!group) {
        throw new Error("Failed to create option group");
      }

      const descriptions = await optionGroupDescriptionUpsertQuery.run(
        {
          values: input.descriptions.map((d) => ({
            name: d.name,
            description: d.description,
            language_id: d.languageId,
            option_group_id: group.id,
          })),
        },
        client,
      );

      return {
        ...group,
        descriptions,
      };
    });
  }

  /** @typedef {{ id?: number }} FindOptionGroupProps */
  /** @param {FindOptionGroupProps} props */
  async findOptionGroup(props) {
    const group = await optionGroupFindOneQuery
      .run(
        {
          id: props.id,
        },
        this.pool,
      )
      .then((res) => res[0]);

    if (!group) return null;

    const descriptions = await optionGroupDescriptionListQuery.run(
      {
        option_group_id: group.id,
      },
      this.pool,
    );

    return {
      ...group,
      descriptions,
    };
  }

  /** @typedef {Partial<CreateOptionGroupProps>} UpdateOptionGroupProps */

  /**
   * @param {number} id
   * @param {UpdateOptionGroupProps} input
   */
  async updateOptionGroup(id, input) {
    return tx(this.pool, async (client) => {
      const group = await optionGroupUpdateQuery
        .run(
          {
            id: id,
            type: input.type,
          },
          client,
        )
        .then((res) => res[0]);

      if (input.descriptions) {
        await optionGroupDescriptionUpsertQuery.run(
          {
            values: input.descriptions.map((d) => ({
              name: d.name,
              description: d.description,
              language_id: d.languageId,
              option_group_id: id,
            })),
          },
          client,
        );
      }

      return group;
    });
  }

  /**
   * @param {{
   *   languageId: number;
   *   name?: string;
   * }} input
   */
  async list(input) {
    const res = await optionGroupListQuery.run(
      {
        language_id: input.languageId,
        name: input.name,
      },
      this.pool,
    );

    return res;
  }
}
