import { Pool, PoolClient } from "pg";
import { catalogQueries as q } from "./queries";
import { filterUpsertEntries } from "./utils";
import { tx } from "@repo/pool";
import { sql } from "@pgtyped/runtime";
import { IAttributeCreateQueryQuery, IAttributeDescriptionUpsertQueryQuery } from "./attribute.types";

export type Attributes = ReturnType<typeof Attributes>;
export function Attributes(f: { pool: Pool }) {
  return {
    createAttribute: createAttribute.bind(null, f.pool),
    upsertAttributeValue: upsertAttributeValue.bind(null, f.pool),
  };
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

type UpsertAttributeValueProps = UpsertAttributeValue & { id?: number };
export async function upsertAttributeValue(
  pool: Pool,
  attributeId: number,
  input: UpsertAttributeValueProps[],
) {
  return tx(pool, async (client) => {
    await upsertAttributeValueTransaction(client, attributeId, input);
  });
}

export async function upsertAttributeValueTransaction(
  client: PoolClient,
  attributeId: number,
  input: UpsertAttributeValueProps[],
) {
  const { toDelete, toUpsert } = filterUpsertEntries(
    input,
    await q.attributeValue.idList.run({
      attributeId: attributeId,
    }, client)
  );

  if (toDelete.length > 0) {
    await q.attributeValue.deleteMany.run({
      ids: toDelete,
    }, client);
  }
  if (toUpsert.length > 0) {
    await q.attributeValue.upsert.run({
      values: toUpsert.map((i) => ({
        id: i.id,
        value: i.value,
        attributeId: attributeId,
      })),
    }, client);
  }
}
