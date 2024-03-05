import { Pool } from "pg";
import { IAttributeGroupCreateQueryQuery, IAttributeGroupDescriptionListQueryQuery, IAttributeGroupDescriptionUpsertQueryQuery, IAttributeGroupFindOneQueryQuery, IAttributeGroupUpdateQueryQuery, IAttributeListQueryQuery } from "./queries/attribute-group.types";
import { sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";

export function AttributeGroups(f: { pool: Pool }) {
  return {
    updateAttributeGroup: updateAttributeGroup.bind(null, f.pool),
    findOneAttributeGroup: findOneAttributeGroup.bind(null, f.pool),
    createAttributeGroup: createAttributeGroup.bind(null, f.pool),
  };
}

export const attributeGroupFindOneQuery = sql<IAttributeGroupFindOneQueryQuery>`
 SELECT id, sort_order
 FROM attribute_groups
 WHERE id = COALESCE($id, id)
 LIMIT 1;
`;
export const attributeGroupDescriptionListQuery = sql<IAttributeGroupDescriptionListQueryQuery>`
  SELECT *
  FROM attribute_group_descriptions
  WHERE attribute_group_id = $attribute_group_id!
`;
export const attributeListQuery = sql<IAttributeListQueryQuery>`
  SELECT id, attribute_group_id, ad.*
  FROM attributes a
  JOIN attribute_descriptions ad
    ON a.id = ad.attribute_id
  WHERE ad.language_id = $language_id!
  AND attribute_group_id = COALESCE($attribute_group_id, attribute_group_id)
`;

type FindOneAttributeGroupProps = {
  languageId: number;
  id?: number;
};
export async function findOneAttributeGroup(pool: Pool, props: FindOneAttributeGroupProps) {
  const group = await attributeGroupFindOneQuery.run({
    id: props.id,
  }, pool).then((res) => res[0]);
  if (!group) return null;

  const descriptions = await attributeGroupDescriptionListQuery.run({
    attribute_group_id: group.id,
  }, pool);
  const attributes = await attributeListQuery.run({
    attribute_group_id: group.id,
    language_id: props.languageId,
  }, pool);

  return {
    ...group,
    descriptions,
    attributes,
  };
}

export const attributeGroupUpdateQuery = sql<IAttributeGroupUpdateQueryQuery>`
  UPDATE attribute_groups
  SET
    sort_order = COALESCE($sort_order, sort_order)
  WHERE
    id = $id!
  RETURNING id;
`;
export const attributeGroupDescriptionUpsertQuery = sql<IAttributeGroupDescriptionUpsertQueryQuery>`
  INSERT INTO attribute_group_descriptions
     (attribute_group_id, language_id, name, description)
  VALUES
     $$values(attribute_group_id!, language_id!, name!, description)
  ON CONFLICT
    (attribute_group_id, language_id)
  DO
    UPDATE
      SET
        name = EXCLUDED.name,
        description = EXCLUDED.description
  RETURNING *;
`;

type UpdateAttributeGroupProps = {
  sortOrder?: number;
  descriptions?: Array<{
    languageId: number;
    name: string;
    description?: string;
  }>;
};
export async function updateAttributeGroup(pool: Pool, id: number, input: UpdateAttributeGroupProps) {
  return tx(pool, async (client) => {
    const group = await attributeGroupUpdateQuery.run({
      sort_order: input.sortOrder,
      id,
    }, client).then((res) => res[0]);
    if (input.descriptions) {
      await attributeGroupDescriptionUpsertQuery.run({
        values: input.descriptions.map((d) => ({
          name: d.name,
          description: d.description,
          language_id: d.languageId,
          attribute_group_id: id,
        })),
      }, client);
    }
    return group;
  });
}

export const attributeGroupCreateQuery = sql<IAttributeGroupCreateQueryQuery>`
  INSERT INTO attribute_groups
    (sort_order)
  VALUES
    ($sort_order!)
  RETURNING id;
`;
type CreateAttributeProps = {
  sortOrder: number;
  descriptions: Array<{
    languageId: number;
    name: string;
    description?: string;
  }>;
};
export async function createAttributeGroup(pool: Pool, input: CreateAttributeProps) {
  return tx(pool, async (client) => {
    const group = await attributeGroupCreateQuery.run({
      sort_order: input.sortOrder,
    }, client).then((res) => res[0]);
    if (!group) {
      throw new Error("Failed to create attribute group");
    }
    await attributeGroupDescriptionUpsertQuery.run({
      values: input.descriptions.map((d) => ({
        name: d.name,
        description: d.description,
        language_id: d.languageId,
        attribute_group_id: group.id,
      })),
    }, client);
    return group;
  });
}
