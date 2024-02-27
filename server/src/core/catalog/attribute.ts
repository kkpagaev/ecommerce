import { Translation } from "./i18n";
import { Pool, PoolClient } from "pg";
import { catalogQueries as q } from "./queries";
import { filterUpsertEntries } from "../utils";
import { tx } from "../../plugins/pool";

export type Attributes = ReturnType<typeof Attributes>;
export function Attributes(f: { pool: Pool }) {
  return {
    upsertAttributeValue: upsertAttributeValue.bind(null, f.pool),
    createAttribute: createAttribute.bind(null, f.pool),
    updateAttribute: updateAttribute.bind(null, f.pool),
  };
}

type CreateAttributeProps = {
  name: Translation;
  description?: Translation;
  values?: Omit<CreateAttributeValue, "attributeId">[];
};
export async function createAttribute(pool: Pool, input: CreateAttributeProps) {
  return tx(pool, async (client) => {
    const att = await q.attribute.create.run({
      values: [{
        name: input.name,
        description: input.description,
      }],
    }, pool).then((r) => r[0]);
    if (input.values) {
      await upsertAttributeValueTransaction(
        client,
        att.id,
        input.values.map((v) => ({
          value: v.value,
          attributeId: att.id,
        }))
      );
    }
    return att;
  });
}

type UpdateAttributeProps = Partial<CreateAttributeProps>;
export async function updateAttribute(pool: Pool, id: number, input: UpdateAttributeProps) {
  const res = await q.attribute.update.run({
    ...input,
    id,
  }, pool);

  return res;
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

type UpsertAttributeValueProps = Array<CreateAttributeValue & { id?: number }>;
export async function upsertAttributeValue(
  pool: Pool,
  attributeId: number,
  input: UpsertAttributeValueProps,
) {
  return tx(pool, async (client) => {
    await upsertAttributeValueTransaction(client, attributeId, input);
  });
}

export async function upsertAttributeValueTransaction(
  client: PoolClient,
  attributeId: number,
  input: UpsertAttributeValueProps,
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

export async function findAttributeById(pool: Pool, id: number) {
  const res = await q.attribute.findById.run({ id }, pool);

  return res;
}
