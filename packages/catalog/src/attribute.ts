import { Pool } from "pg";
import { tx } from "@repo/pool";
import { sql } from "@pgtyped/runtime";
import { IAttributeDescriptionDeleteQueryQuery, IAttributeDeletQueryQuery, IAttributeCreateQueryQuery, IAttributeDescriptionUpsertQueryQuery } from "./attribute.types";

export type Attributes = ReturnType<typeof Attributes>;
export function Attributes(f: { pool: Pool }) {
  return {
    createAttribute: createAttribute.bind(null, f.pool),
    deleteAttribute: deleteAttribute.bind(null, f.pool),
    updateAttribute: updateAttribute.bind(null, f.pool),
    deleteAttributeDescription: deleteAttributeDescription.bind(null, f.pool),
  };
}

export const attributeDescriptionDeleteQuery = sql<IAttributeDescriptionDeleteQueryQuery>`
  DELETE FROM attribute_descriptions
  WHERE language_id = $languageId!
  AND attribute_id = $attributeId!;
`;
export async function deleteAttributeDescription(pool: Pool, input: { attributeId: number; languageId: number }) {
  return await attributeDescriptionDeleteQuery.run(input, pool);
}
type UpdateAttributeProps = {
  descriptions: Array<{
    languageId: number;
    name: string;
  }>;
};
export async function updateAttribute(pool: Pool, id: number, input: UpdateAttributeProps) {
  return await tx(pool, async (client) => {
    const descriptions = await attributeDescriptionUpsertQuery.run({
      values: input.descriptions.map((d) => ({
        name: d.name,
        languageId: d.languageId,
        attributeId: id,
      })),
    }, client);

    return {
      descriptions,
    };
  });
}
export const attributeDeletQuery = sql<IAttributeDeletQueryQuery>`
  DELETE FROM attributes
  WHERE id = $id!;
`;
export async function deleteAttribute(pool: Pool, id: number) {
  return await attributeDeletQuery.run({
    id: id,
  }, pool);
}

export const attributeCreateQuery = sql<IAttributeCreateQueryQuery>`
  INSERT INTO attributes
    (attribute_group_id)
  VALUES
    ($attributeGroupId!)
  RETURNING id;
`;
export const attributeDescriptionUpsertQuery = sql<IAttributeDescriptionUpsertQueryQuery>`
  INSERT INTO attribute_descriptions
    (attribute_id, language_id, name)
  VALUES
    $$values(attributeId!, languageId!, name!)
  ON CONFLICT
    (attribute_id, language_id)
  DO UPDATE
    SET
      name = EXCLUDED.name
`;
type CreateAttribute = {
  groupId: number;
  descriptions: Array<{
    languageId: number;
    name: string;
  }>;
};
export async function createAttribute(
  pool: Pool,
  input: CreateAttribute,
) {
  return tx(pool, async (client) => {
    const attribute = await attributeCreateQuery.run({
      attributeGroupId: input.groupId,
    }, pool).then((r) => r[0]);
    if (!attribute) throw new Error("Failed to create attribute");
    const descriptions = await attributeDescriptionUpsertQuery.run({
      values: input.descriptions.map((d) => ({
        name: d.name,
        languageId: d.languageId,
        attributeId: attribute.id,
      })),
    }, client);

    return {
      ...attribute,
      descriptions,
    };
  });
}
