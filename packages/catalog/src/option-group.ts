import { Pool } from "pg";
import { sql, TaggedQuery } from "@pgtyped/runtime";
import { IOptionGroupDescriptionListQueryQuery, IOptionGroupFindOneQueryQuery, IOptionGroupUpdateQueryQuery, IOptionGroupDescriptionUpsertQueryQuery, IOptionGroupCreateQueryQuery, option_type } from "./queries/option-group.types";
import { tx } from "@repo/pool";

export const optionGroupCreateQuery = sql<IOptionGroupCreateQueryQuery>`
  INSERT INTO option_groups
    (sort_order, type)
  VALUES
    ($sort_order!, $type!)
  RETURNING id
`;

export const optionGroupFindOneQuery = sql<IOptionGroupFindOneQueryQuery>`
  SELECT
    *
  FROM
    option_groups
  WHERE
    id = COALESCE($id, id)
  LIMIT 1;
`;

export const optionGroupDescriptionListQuery = sql<IOptionGroupDescriptionListQueryQuery>`
  SELECT
    *
  FROM
    option_group_descriptions
  WHERE
    option_group_id = $option_group_id!
  ORDER BY
    language_id
`;

export const optionGroupUpdateQuery = sql<IOptionGroupUpdateQueryQuery>`
  UPDATE option_groups
  SET
    sort_order = COALESCE($sort_order, sort_order),
    type = COALESCE($type, type)
  WHERE
    id = $id!
  RETURNING id
`;

export const optionGroupDescriptionUpsertQuery = sql<IOptionGroupDescriptionUpsertQueryQuery>`
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

export function OptionGroups(f: { pool: Pool }) {
  return {
    createOptionGroup: createOptionGroup.bind(null, f.pool),
    updateOptionGroup: updateOptionGroup.bind(null, f.pool),
    findOptionGroup: findOptionGroup.bind(null, f.pool),
  };
}

type CreateOptionGroupProps = {
  type: option_type;
  sortOrder: number;
  descriptions: Array<{
    name: string;
    languageId: number;
    description?: string;
  }>;
};
async function createOptionGroup(pool: Pool, input: CreateOptionGroupProps) {
  return tx(pool, async (client) => {
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

type UpdateOptionGroupProps = Partial<CreateOptionGroupProps>;
export async function updateOptionGroup(pool: Pool, id: number, input: UpdateOptionGroupProps) {
  return tx(pool, async (client) => {
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

export type FindOptionGroupProps = {
  id?: number;
};
/**
 * @this {Pool}
 */
export async function findOptionGroup(pool: Pool, props: FindOptionGroupProps) {
  const group = await optionGroupFindOneQuery
    .run({
      id: props.id,
    }, pool)
    .then((res) => res[0]);
  if (!group) return null;
  const descriptions = await optionGroupDescriptionListQuery.run({
    option_group_id: group.id,
  }, pool);

  return {
    ...group,
    descriptions,
  };
}
