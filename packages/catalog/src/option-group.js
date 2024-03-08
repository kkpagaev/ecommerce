/** @typedef {import("@pgtyped/runtime").TaggedQuery} TaggedQuery **/
/** @typedef {import("pg").Pool} Pool **/
/** @typedef {import("./queries/option-group.types")} T **/
import { sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";

/** @type {TaggedQuery<T.IOptionGroupCreateQueryQuery} **/
export const optionGroupCreateQuery = sql`
  INSERT INTO option_groups
    (sort_order, type)
  VALUES
    ($sort_order!, $type!)
  RETURNING id
`;

/** @type {TaggedQuery<T.IOptionGroupFindOneQueryQuery>} **/
export const optionGroupFindOneQuery = sql`
  SELECT
    *
  FROM
    option_groups
  WHERE
    id = COALESCE($id, id)
  LIMIT 1;
`;

/** @type {TaggedQuery<T.IOptionGroupDescriptionListQueryQuery>} **/
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

/** @type {TaggedQuery<T.IOptionGroupUpdateQueryQuery>} **/
export const optionGroupUpdateQuery = sql`
  UPDATE option_groups
  SET
    sort_order = COALESCE($sort_order, sort_order),
    type = COALESCE($type, type)
  WHERE
    id = $id!
  RETURNING id
`;

/** @type {TaggedQuery<T.IOptionGroupDescriptionUpsertQueryQuery>} **/
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

export class OptionGroups {
  /**
   * @param {{ pool: Pool }} f
   */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef CreateOptionGroupProps
   * @prop {option_type} type
   * @prop {number} sortOrder
   * @prop {Array<{
       name: string;
       languageId: number;
       description?: string
     }>} descriptions
   */

  /**
   * @param {CreateOptionGroupProps} input
   * @throws Error
   */
  async createOptionGroup(input) {
    return tx(this.pool, async (client) => {
      const group = await optionGroupCreateQuery.run({
        sort_order: input.sortOrder,
        type: input.type,
      }, client).then((res) => res[0]);
      if (!group) {
        throw new Error("Failed to create option group");
      }

      const descriptions = await optionGroupDescriptionUpsertQuery.run({
        values: input.descriptions.map((d) => ({
          name: d.name,
          description: d.description,
          language_id: d.languageId,
          option_group_id: group.id,
        })),
      }, client);

      return {
        ...group,
        descriptions,
      };
    });
  }

  /**
   * @typedef FindOptionGroupProps
   * @prop {number | undefined} id
   */

  /**
    * @param {FindOptionGroupProps} props
   */
  async findOptionGroup(props) {
    const group = await optionGroupFindOneQuery
      .run({
        id: props.id,
      }, this.pool)
      .then((res) => res[0]);

    if (!group) return null;

    const descriptions = await optionGroupDescriptionListQuery.run({
      option_group_id: group.id,
    }, this.pool);

    return {
      ...group,
      descriptions,
    };
  }

  /**
   * @typedef {Partial<CreateOptionGroupProps>} UpdateOptionGroupProps
   */

  /**
    * @param {number} id
    * @param {UpdateOptionGroupProps} input
   */
  async updateOptionGroup(id, input) {
    return tx(this.pool, async (client) => {
      const group = await optionGroupUpdateQuery.run({
        id: id,
        type: input.type,
        sort_order: input.sortOrder,
      }, client).then((res) => res[0]);

      if (input.descriptions) {
        await optionGroupDescriptionUpsertQuery.run({
          values: input.descriptions.map((d) => ({
            name: d.name,
            description: d.description,
            language_id: d.languageId,
            option_group_id: id,
          })),
        }, client);
      }

      return group;
    });
  }
}
