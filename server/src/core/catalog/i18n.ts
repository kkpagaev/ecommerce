import { Pool } from "pg";
import { createTranslationQuery, locale } from "./query/i18n.queries";
import { randomUUID } from "crypto";

export type I18n = ReturnType<typeof I18n>;
export function I18n({ pool }: { pool: Pool }) {
  return {
    createTranslation: createTranslation.bind(null, pool),
  };
}

export type CreateTranslationProps = Array<{
  locale: locale;
  value: string;
}>;
export async function createTranslation(
  pool: Pool,
  input: CreateTranslationProps
) {
  const id = randomUUID().toString();
  const translations = await createTranslationQuery.run({
    translations: input.map((v) => ({
      ...v,
      id: id,
    })),
  }, pool);

  return translations;
}
