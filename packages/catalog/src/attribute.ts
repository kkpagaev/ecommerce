import { Translation } from "./i18n";
import { Pool, PoolClient } from "pg";
import { catalogQueries as q } from "./queries";
import { filterUpsertEntries } from "./utils";
import { tx } from "@repo/pool";

export type Attributes = ReturnType<typeof Attributes>;
export function Attributes(f: { pool: Pool }) {
  return {
    upsertAttributeValue: upsertAttributeValue.bind(null, f.pool),
  };
}

type CreateAttributeValue = {
  attributeId: number;
  value: Translation;
};
type CreateAttributeValueProps = CreateAttributeValue[];
export async function createAttributeValue(
  pool: Pool,
  input: CreateAttributeValueProps,
) {
  return q.attributeValue.create.run({
    values: input,
  }, pool);
}

type UpsertAttributeValueProps = CreateAttributeValue & { id?: number };
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
