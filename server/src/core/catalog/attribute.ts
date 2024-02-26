import { Translation } from "./i18n";
import { Pool } from "pg";
import { catalogQueries as queries } from "./queries";

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
  const res = await queries.attribute.create.run({
    values: [{
      name: input.name,
      description: input.description,
    }],
  }, pool);

  return res[0];
}

type UpdateAttributeProps = Partial<CreateAttributeProps>;
export async function updateAttribute(pool: Pool, id: number, input: UpdateAttributeProps) {
  const res = await queries.attribute.update.run({
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
  return queries.attributeValue.create.run({
    values: [
      input,
    ],
  }, pool);
}

export async function findAttributeById(pool: Pool, id: number) {
  const res = await queries.attribute.findById.run({ id }, pool);

  return res;
}
