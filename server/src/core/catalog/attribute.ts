import { Translation } from "./i18n";
import { Pool } from "pg";
import { sql } from "@pgtyped/runtime";
import { attributeCreateQuery, attributeUpdateQuery, attributeValuesCreateQuery } from "./queries";

export type Attributes = ReturnType<typeof Attributes>;
export function Attributes(f: { pool: Pool }) {
  return {
    createAttribute: createAttribute.bind(null, f.pool),
    updateAttribute: updateAttribute.bind(null, f.pool),
  };
}

type CreateAttributeProps = {
  name: Translation;
  description?: Translation;
};
export async function createAttribute(pool: Pool, input: CreateAttributeProps) {
  const res = await attributeCreateQuery.run(input, pool);

  return res[0];
}

type UpdateAttributeProps = Partial<CreateAttributeProps>;
export async function updateAttribute(pool: Pool, id: number, input: UpdateAttributeProps) {
  const res = await attributeUpdateQuery.run({
    ...input,
    id,
  }, pool);

  return res;
}

type CreateAttributeValueProps = {
  attributeId: number;
  value: Translation;
};
export async function createAttributeValue(pool: Pool, input: CreateAttributeValueProps) {
  return attributeValuesCreateQuery.run({
    values: [
      input,
    ],
  }, pool);
}

const findAttributeByIdQuery = sql`SELECT * FROM attributes WHERE id = :id!`;

export async function findAttributeById(pool: Pool, id: number) {
  const res = await findAttributeByIdQuery.run({ id }, pool);

  return res;
}
